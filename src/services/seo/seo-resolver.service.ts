import type { Metadata } from "next";

import { SEO_ENTITY_TYPES, SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { ROUTES } from "@/constants/routes";
import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
import { CACHE_TAGS, cachedQuery } from "@/lib/cache/server";
import { resolveFaviconUrl } from "@/lib/seo/favicon";
import { resolveSeoImageUrl } from "@/lib/seo/resolve-image-url";
import { absoluteUrl } from "@/lib/url";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { ResolvedSeoMetadata } from "@/types/seo-management";
import type { PageMetadataInput } from "@/types/seo";

function mapTwitterCard(
  card?: "SUMMARY" | "SUMMARY_LARGE_IMAGE" | null,
): "summary" | "summary_large_image" {
  return card === "SUMMARY" ? "summary" : "summary_large_image";
}

function applyTitleTemplate(title: string | undefined, template: string, siteName: string): string {
  if (!title) {
    return siteName;
  }

  return template.replace("%s", title).replace("%siteName%", siteName);
}

export async function resolvePageSeo(
  pageKey: string,
  fallback: Partial<PageMetadataInput> = {},
  locale = DEFAULT_LOCALE,
): Promise<ResolvedSeoMetadata> {
  const fallbackKey = JSON.stringify({
    title: fallback.title,
    description: fallback.description,
    pathname: fallback.pathname,
    ogImagePath: fallback.ogImagePath,
  });

  return cachedQuery(
    `seo-page:${locale}:${pageKey}:${fallbackKey}`,
    [CACHE_TAGS.seo],
    () => resolvePageSeoFromDb(pageKey, fallback, locale),
  );
}

async function resolvePageSeoFromDb(
  pageKey: string,
  fallback: Partial<PageMetadataInput> = {},
  locale = DEFAULT_LOCALE,
): Promise<ResolvedSeoMetadata> {
  const [globalSettings, page] = await Promise.all([
    seoRepository.getGlobalSettings(locale),
    seoRepository.getPageByKey(pageKey, locale),
  ]);

  const siteName = globalSettings.siteTitle || siteConfig.name;
  const pathname = page?.routePath ?? fallback.pathname ?? "/";
  const title = page?.metaTitle ?? fallback.title;
  const description = page?.metaDescription ?? fallback.description ?? globalSettings.siteDescription;
  const keywords = page?.keywords?.length
    ? page.keywords
    : fallback.keywords ?? globalSettings.defaultKeywords;

  const robotsIndex = page?.robotsIndex ?? globalSettings.defaultRobotsIndex;
  const robotsFollow = page?.robotsFollow ?? globalSettings.defaultRobotsFollow;
  const noIndex = !robotsIndex;

  const defaultOg = globalSettings.defaultOgImageUrl ?? seoConfig.ogImagePath;

  return {
    title: applyTitleTemplate(title, globalSettings.titleTemplate, siteName),
    description,
    keywords,
    pathname,
    canonicalUrl: page?.canonicalUrl ?? absoluteUrl(pathname),
    focusKeyword: page?.focusKeyword ?? undefined,
    ogTitle: page?.ogTitle ?? title ?? siteName,
    ogDescription: page?.ogDescription ?? description,
    ogImageUrl: resolveSeoImageUrl(page?.ogImageUrl, fallback.ogImagePath ?? defaultOg),
    ogImageAlt: page?.ogImageAlt ?? `${siteName} — ${globalSettings.defaultAuthorName}`,
    ogType: (page?.ogType as ResolvedSeoMetadata["ogType"]) ?? "website",
    twitterCardType: mapTwitterCard(page?.twitterCardType),
    twitterImageUrl: resolveSeoImageUrl(
      page?.twitterImageUrl ?? page?.ogImageUrl,
      globalSettings.defaultTwitterImageUrl ?? defaultOg,
    ),
    twitterHandle: globalSettings.twitterHandle ?? seoConfig.twitterHandle ?? undefined,
    faviconPath: resolveFaviconUrl(
      globalSettings.faviconPath ?? seoConfig.faviconPath,
      globalSettings.updatedAt,
    ),
    authorName: globalSettings.defaultAuthorName || siteConfig.author.name,
    robots: noIndex
      ? { index: false, follow: robotsFollow }
      : { index: true, follow: robotsFollow },
  };
}

export async function resolveEntitySeo(
  entityType: string,
  entityId: string,
  fallback: Partial<PageMetadataInput> & {
    ogType?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
  } = {},
  locale = DEFAULT_LOCALE,
): Promise<ResolvedSeoMetadata> {
  const fallbackKey = JSON.stringify({
    title: fallback.title,
    description: fallback.description,
    pathname: fallback.pathname,
    ogImagePath: fallback.ogImagePath,
    ogType: fallback.ogType,
    publishedTime: fallback.publishedTime,
    modifiedTime: fallback.modifiedTime,
  });

  return cachedQuery(
    `seo-entity:${locale}:${entityType}:${entityId}:${fallbackKey}`,
    [CACHE_TAGS.seo],
    () => resolveEntitySeoFromDb(entityType, entityId, fallback, locale),
  );
}

async function resolveEntitySeoFromDb(
  entityType: string,
  entityId: string,
  fallback: Partial<PageMetadataInput> & {
    ogType?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
  } = {},
  locale = DEFAULT_LOCALE,
): Promise<ResolvedSeoMetadata> {
  const [globalSettings, metadata] = await Promise.all([
    seoRepository.getGlobalSettings(locale),
    seoRepository.getMetadata(entityType, entityId),
  ]);

  const siteName = globalSettings.siteTitle || siteConfig.name;
  const pathname = fallback.pathname ?? "/";
  const title = metadata?.metaTitle ?? fallback.title;
  const description =
    metadata?.metaDescription ?? fallback.description ?? globalSettings.siteDescription;
  const keywords = metadata?.keywords?.length
    ? metadata.keywords
    : fallback.keywords ?? globalSettings.defaultKeywords;

  const robotsIndex = metadata?.robotsIndex ?? globalSettings.defaultRobotsIndex;
  const robotsFollow = metadata?.robotsFollow ?? globalSettings.defaultRobotsFollow;

  const defaultOg = globalSettings.defaultOgImageUrl ?? seoConfig.ogImagePath;
  const ogType =
    (metadata?.ogType as ResolvedSeoMetadata["ogType"]) ??
    fallback.ogType ??
    (entityType === SEO_ENTITY_TYPES.BLOG_POST ? "article" : "website");

  return {
    title: applyTitleTemplate(title, globalSettings.titleTemplate, siteName),
    description,
    keywords,
    pathname,
    canonicalUrl: metadata?.canonicalUrl ?? absoluteUrl(pathname),
    focusKeyword: metadata?.focusKeyword ?? undefined,
    ogTitle: metadata?.ogTitle ?? title ?? siteName,
    ogDescription: metadata?.ogDescription ?? description,
    ogImageUrl: resolveSeoImageUrl(metadata?.ogImageUrl, fallback.ogImagePath ?? defaultOg),
    ogImageAlt: metadata?.ogImageAlt ?? `${siteName}`,
    ogType,
    twitterCardType: mapTwitterCard(metadata?.twitterCardType),
    twitterImageUrl: resolveSeoImageUrl(
      metadata?.twitterImageUrl ?? metadata?.ogImageUrl,
      globalSettings.defaultTwitterImageUrl ?? defaultOg,
    ),
    twitterHandle: globalSettings.twitterHandle ?? seoConfig.twitterHandle ?? undefined,
    faviconPath: resolveFaviconUrl(
      globalSettings.faviconPath ?? seoConfig.faviconPath,
      globalSettings.updatedAt,
    ),
    authorName: globalSettings.defaultAuthorName || siteConfig.author.name,
    publishedTime: fallback.publishedTime,
    modifiedTime: fallback.modifiedTime,
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
    },
  };
}

function mergeResolvedSeo(
  page: ResolvedSeoMetadata,
  entity: ResolvedSeoMetadata,
): ResolvedSeoMetadata {
  return {
    pathname: entity.pathname || page.pathname,
    title: entity.title ?? page.title,
    description: entity.description ?? page.description,
    keywords: entity.keywords?.length ? entity.keywords : page.keywords,
    canonicalUrl: entity.canonicalUrl ?? page.canonicalUrl,
    focusKeyword: entity.focusKeyword ?? page.focusKeyword,
    ogTitle: entity.ogTitle ?? page.ogTitle,
    ogDescription: entity.ogDescription ?? page.ogDescription,
    ogImageUrl: entity.ogImageUrl ?? page.ogImageUrl,
    ogImageAlt: entity.ogImageAlt ?? page.ogImageAlt,
    ogType: entity.ogType ?? page.ogType,
    twitterCardType: entity.twitterCardType ?? page.twitterCardType,
    twitterImageUrl: entity.twitterImageUrl ?? page.twitterImageUrl,
    twitterHandle: entity.twitterHandle ?? page.twitterHandle,
    faviconPath: entity.faviconPath ?? page.faviconPath,
    authorName: entity.authorName ?? page.authorName,
    publishedTime: entity.publishedTime ?? page.publishedTime,
    modifiedTime: entity.modifiedTime ?? page.modifiedTime,
    robots: entity.robots ?? page.robots,
  };
}

export function resolvedSeoToMetadata(resolved: ResolvedSeoMetadata): Metadata {
  const isArticle = resolved.ogType === "article";

  return {
    metadataBase: new URL(absoluteUrl()),
    title: resolved.title,
    description: resolved.description,
    keywords: resolved.keywords ? [...resolved.keywords] : undefined,
    icons: resolved.faviconPath
      ? {
          icon: resolved.faviconPath,
          shortcut: resolved.faviconPath,
        }
      : undefined,
    authors: resolved.authorName
      ? [{ name: resolved.authorName, url: absoluteUrl() }]
      : undefined,
    creator: resolved.authorName,
    alternates: resolved.canonicalUrl
      ? { canonical: resolved.canonicalUrl }
      : undefined,
    robots: resolved.robots
      ? {
          index: resolved.robots.index,
          follow: resolved.robots.follow,
        }
      : undefined,
    openGraph: {
      type: resolved.ogType ?? "website",
      locale: siteConfig.locale,
      url: resolved.canonicalUrl ?? absoluteUrl(resolved.pathname),
      siteName: siteConfig.name,
      title: resolved.ogTitle ?? resolved.title,
      description: resolved.ogDescription ?? resolved.description,
      images: resolved.ogImageUrl
        ? [
            {
              url: resolved.ogImageUrl,
              width: 1200,
              height: 630,
              alt: resolved.ogImageAlt ?? siteConfig.name,
            },
          ]
        : undefined,
      ...(isArticle && resolved.publishedTime
        ? {
            publishedTime: resolved.publishedTime,
            modifiedTime: resolved.modifiedTime ?? resolved.publishedTime,
          }
        : {}),
    },
    twitter: {
      card: resolved.twitterCardType ?? "summary_large_image",
      title: resolved.ogTitle ?? resolved.title,
      description: resolved.ogDescription ?? resolved.description,
      creator: resolved.twitterHandle,
      images: resolved.twitterImageUrl ? [resolved.twitterImageUrl] : undefined,
    },
  };
}

export async function buildPageMetadata(
  pageKey: string,
  fallback: Partial<PageMetadataInput> = {},
): Promise<Metadata> {
  const resolved = await resolvePageSeo(pageKey, fallback);
  return resolvedSeoToMetadata(resolved);
}

export async function buildEntityMetadata(
  entityType: string,
  entityId: string,
  fallback: Partial<PageMetadataInput> & {
    ogType?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
  } = {},
): Promise<Metadata> {
  const resolved = await resolveEntitySeo(entityType, entityId, fallback);
  return resolvedSeoToMetadata(resolved);
}

export async function buildResumeMetadata(
  resumeId: string,
  fallback: Partial<PageMetadataInput> = {},
): Promise<Metadata> {
  const [pageResolved, entityResolved] = await Promise.all([
    resolvePageSeo(SEO_PAGE_KEYS.RESUME, fallback),
    resolveEntitySeo(SEO_ENTITY_TYPES.RESUME, resumeId, {
      ...fallback,
      pathname: fallback.pathname ?? ROUTES.resume,
      ogType: "profile",
    }),
  ]);

  return resolvedSeoToMetadata(mergeResolvedSeo(pageResolved, entityResolved));
}
