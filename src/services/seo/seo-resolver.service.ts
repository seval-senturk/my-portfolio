import type { Metadata } from "next";

import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
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
    robots: noIndex
      ? { index: false, follow: robotsFollow }
      : { index: true, follow: robotsFollow },
  };
}

export async function resolveEntitySeo(
  entityType: string,
  entityId: string,
  fallback: Partial<PageMetadataInput> & { ogType?: "website" | "article" | "profile" } = {},
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
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
    },
  };
}

export function resolvedSeoToMetadata(resolved: ResolvedSeoMetadata): Metadata {
  return {
    metadataBase: new URL(absoluteUrl()),
    title: resolved.title,
    description: resolved.description,
    keywords: resolved.keywords ? [...resolved.keywords] : undefined,
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
              alt: resolved.ogImageAlt ?? siteConfig.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: resolved.twitterCardType ?? "summary_large_image",
      title: resolved.ogTitle ?? resolved.title,
      description: resolved.ogDescription ?? resolved.description,
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
  fallback: Partial<PageMetadataInput> & { ogType?: "website" | "article" | "profile" } = {},
): Promise<Metadata> {
  const resolved = await resolveEntitySeo(entityType, entityId, fallback);
  return resolvedSeoToMetadata(resolved);
}
