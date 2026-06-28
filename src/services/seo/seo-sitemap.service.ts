import type { MetadataRoute } from "next";

import { INDEXABLE_STATIC_SEO_PAGES } from "@/lib/seo/public-routes";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export async function buildDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  const globalSettings = await seoRepository.getGlobalSettings(DEFAULT_LOCALE);
  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);

  const [seoPages, blogPosts, resume] = await Promise.all([
    prisma.seoPage.findMany({
      where: {
        locale: DEFAULT_LOCALE,
        pageKey: { in: INDEXABLE_STATIC_SEO_PAGES.map((page) => page.pageKey) },
      },
      select: { routePath: true, updatedAt: true, pageKey: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.resume.findUnique({
      where: { locale: DEFAULT_LOCALE },
      select: { updatedAt: true, contentUpdatedAt: true },
    }),
  ]);

  const pageUpdatedAt = new Map(
    seoPages.map((page) => [page.pageKey, page.updatedAt]),
  );

  const staticEntries: MetadataRoute.Sitemap = INDEXABLE_STATIC_SEO_PAGES.map((page) => ({
    url: `${siteUrl}${page.routePath}`,
    lastModified: pageUpdatedAt.get(page.pageKey) ?? new Date(),
    changeFrequency: page.pageKey === "home" ? "weekly" : "monthly",
    priority: page.pageKey === "home" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const resumeEntry: MetadataRoute.Sitemap = resume
    ? [
        {
          url: `${siteUrl}/resume`,
          lastModified: resume.contentUpdatedAt ?? resume.updatedAt,
          changeFrequency: "monthly",
          priority: 0.85,
        },
      ]
    : [];

  return [...staticEntries, ...blogEntries, ...resumeEntry];
}

export async function buildDynamicRobots(): Promise<MetadataRoute.Robots> {
  const globalSettings = await seoRepository.getGlobalSettings(DEFAULT_LOCALE);
  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);

  const allowIndexing = env.isProduction && globalSettings.defaultRobotsIndex;

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? ["/admin"] : ["/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
