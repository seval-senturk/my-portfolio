import type { MetadataRoute } from "next";

import { SEO_PAGE_DEFINITIONS } from "@/constants/seo-pages";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export async function buildDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  const globalSettings = await seoRepository.getGlobalSettings(DEFAULT_LOCALE);
  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);

  const staticEntries: MetadataRoute.Sitemap = SEO_PAGE_DEFINITIONS.map((page) => ({
    url: `${siteUrl}${page.routePath}`,
    lastModified: new Date(),
    changeFrequency: page.pageKey === "home" ? "weekly" : "monthly",
    priority: page.pageKey === "home" ? 1 : 0.7,
  }));

  const [blogPosts, projects, resume] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.project.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.resume.findUnique({
      where: { locale: DEFAULT_LOCALE },
      select: { updatedAt: true, contentUpdatedAt: true },
    }),
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ?? post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects#${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const resumeEntry: MetadataRoute.Sitemap = resume
    ? [
        {
          url: `${siteUrl}/resume`,
          lastModified: resume.updatedAt,
          changeFrequency: "monthly",
          priority: 0.75,
        },
      ]
    : [];

  const aiCareerEntry: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/career`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
  ];

  return [...staticEntries, ...blogEntries, ...projectEntries, ...resumeEntry, ...aiCareerEntry];
}

export async function buildDynamicRobots(): Promise<MetadataRoute.Robots> {
  const globalSettings = await seoRepository.getGlobalSettings(DEFAULT_LOCALE);
  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);

  const allowIndexing = env.isProduction && globalSettings.defaultRobotsIndex;

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? undefined : ["/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
