import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { SeoHealthIssue, SeoHealthReport, SeoOverviewStats } from "@/types/seo-management";

function pushIssue(
  issues: SeoHealthIssue[],
  issue: Omit<SeoHealthIssue, "id">,
): void {
  issues.push({ ...issue, id: `${issue.category}-${issue.entityType}-${issue.entityId}` });
}

export async function runSeoHealthCheck(): Promise<SeoHealthReport> {
  const issues: SeoHealthIssue[] = [];
  const locale = DEFAULT_LOCALE;

  const [pages, blogPosts, projects, redirects, resume] = await Promise.all([
    seoRepository.ensurePageRecords(locale),
    prisma.blogPost.findMany({
      select: { id: true, title: true, slug: true, coverImageAlt: true },
    }),
    prisma.project.findMany({
      select: { id: true, title: true, slug: true, coverImageUrl: true },
    }),
    seoRepository.listRedirects(),
    prisma.resume.findUnique({ where: { locale } }),
  ]);

  const metadataRecords = await prisma.seoMetadata.findMany();
  const metadataByKey = new Map(
    metadataRecords.map((record) => [`${record.entityType}:${record.entityId}`, record]),
  );

  for (const page of pages) {
    if (!page.metaTitle?.trim()) {
      pushIssue(issues, {
        severity: "error",
        category: "missing_title",
        message: "Meta title is missing.",
        entityType: "page",
        entityId: page.pageKey,
        entityLabel: page.label,
        fixHref: `${ADMIN_ROUTES.seo}/pages`,
      });
    }

    if (!page.metaDescription?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_description",
        message: "Meta description is missing.",
        entityType: "page",
        entityId: page.pageKey,
        entityLabel: page.label,
        fixHref: `${ADMIN_ROUTES.seo}/pages`,
      });
    }

    if (!page.ogImageUrl?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_og_image",
        message: "Open Graph image is missing.",
        entityType: "page",
        entityId: page.pageKey,
        entityLabel: page.label,
        fixHref: `${ADMIN_ROUTES.seo}/pages`,
      });
    }

    if (page.canonicalUrl) {
      try {
        new URL(page.canonicalUrl);
      } catch {
        pushIssue(issues, {
          severity: "error",
          category: "broken_canonical",
          message: "Canonical URL is invalid.",
          entityType: "page",
          entityId: page.pageKey,
          entityLabel: page.label,
          fixHref: `${ADMIN_ROUTES.seo}/pages`,
        });
      }
    }
  }

  for (const post of blogPosts) {
    const seo = metadataByKey.get(`${SEO_ENTITY_TYPES.BLOG_POST}:${post.id}`);
    if (!seo?.metaTitle?.trim()) {
      pushIssue(issues, {
        severity: "error",
        category: "missing_title",
        message: "Blog SEO title is missing.",
        entityType: SEO_ENTITY_TYPES.BLOG_POST,
        entityId: post.id,
        entityLabel: post.title,
        fixHref: `${ADMIN_ROUTES.blog}/${post.id}/edit`,
      });
    }

    if (!seo?.metaDescription?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_description",
        message: "Blog meta description is missing.",
        entityType: SEO_ENTITY_TYPES.BLOG_POST,
        entityId: post.id,
        entityLabel: post.title,
        fixHref: `${ADMIN_ROUTES.blog}/${post.id}/edit`,
      });
    }

    if (!seo?.ogImageUrl?.trim() && !post.coverImageAlt?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_alt",
        message: "Blog OG image or cover alt text is missing.",
        entityType: SEO_ENTITY_TYPES.BLOG_POST,
        entityId: post.id,
        entityLabel: post.title,
        fixHref: `${ADMIN_ROUTES.blog}/${post.id}/edit`,
      });
    }
  }

  for (const project of projects) {
    const seo = metadataByKey.get(`${SEO_ENTITY_TYPES.PROJECT}:${project.id}`);
    if (!seo?.metaTitle?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_title",
        message: "Project SEO title is missing.",
        entityType: SEO_ENTITY_TYPES.PROJECT,
        entityId: project.id,
        entityLabel: project.title,
        fixHref: `${ADMIN_ROUTES.seo}/projects`,
      });
    }
  }

  if (resume) {
    const resumeSeo = metadataByKey.get(`${SEO_ENTITY_TYPES.RESUME}:${resume.id}`);
    if (!resumeSeo?.metaTitle?.trim()) {
      pushIssue(issues, {
        severity: "warning",
        category: "missing_title",
        message: "Resume SEO title is missing.",
        entityType: SEO_ENTITY_TYPES.RESUME,
        entityId: resume.id,
        entityLabel: "Resume Center",
        fixHref: `${ADMIN_ROUTES.seo}/resume`,
      });
    }
  }

  const titleMap = new Map<string, string[]>();
  const descriptionMap = new Map<string, string[]>();

  for (const page of pages) {
    if (page.metaTitle) {
      const key = page.metaTitle.trim().toLowerCase();
      titleMap.set(key, [...(titleMap.get(key) ?? []), page.label]);
    }
    if (page.metaDescription) {
      const key = page.metaDescription.trim().toLowerCase();
      descriptionMap.set(key, [...(descriptionMap.get(key) ?? []), page.label]);
    }
  }

  for (const [title, labels] of titleMap.entries()) {
    if (labels.length > 1) {
      pushIssue(issues, {
        severity: "warning",
        category: "duplicate_title",
        message: `Duplicate meta title "${title}" on: ${labels.join(", ")}`,
        entityType: "page",
        entityId: "duplicate-title",
        entityLabel: labels.join(", "),
        fixHref: `${ADMIN_ROUTES.seo}/pages`,
      });
    }
  }

  for (const [, labels] of descriptionMap.entries()) {
    if (labels.length > 1) {
      pushIssue(issues, {
        severity: "warning",
        category: "duplicate_description",
        message: `Duplicate meta description on: ${labels.join(", ")}`,
        entityType: "page",
        entityId: "duplicate-description",
        entityLabel: labels.join(", "),
        fixHref: `${ADMIN_ROUTES.seo}/pages`,
      });
    }
  }

  for (const redirect of redirects) {
    if (!redirect.isActive) continue;

    try {
      if (redirect.toPath.startsWith("http")) {
        new URL(redirect.toPath);
      } else if (!redirect.toPath.startsWith("/")) {
        throw new Error("Invalid path");
      }
    } catch {
      pushIssue(issues, {
        severity: "error",
        category: "broken_redirect",
        message: `Redirect target is invalid: ${redirect.fromPath} → ${redirect.toPath}`,
        entityType: "redirect",
        entityId: redirect.id,
        entityLabel: redirect.fromPath,
        fixHref: `${ADMIN_ROUTES.seo}/redirects`,
      });
    }
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const penalty = errorCount * 8 + warningCount * 3;
  const score = Math.max(0, 100 - penalty);

  return {
    score,
    issueCount: issues.length,
    issues,
  };
}

export async function getSeoOverviewStats(): Promise<SeoOverviewStats> {
  const [pages, blogPostCount, projectCount, redirectCount, health] = await Promise.all([
    seoRepository.ensurePageRecords(DEFAULT_LOCALE),
    prisma.blogPost.count(),
    prisma.project.count(),
    prisma.seoRedirect.count(),
    runSeoHealthCheck(),
  ]);

  return {
    pageCount: pages.length,
    blogPostCount,
    projectCount,
    redirectCount,
    healthScore: health.score,
    issueCount: health.issueCount,
  };
}

export function getPublicSiteUrl(): string {
  return env.siteUrl;
}
