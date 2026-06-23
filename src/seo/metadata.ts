import type { Metadata } from "next";

import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
import { absoluteUrl } from "@/lib/url";
import type { PageMetadataInput } from "@/types/seo";

function resolveTitle(title?: string): string {
  if (!title) {
    return seoConfig.defaultTitle;
  }

  if (title === siteConfig.name) {
    return seoConfig.defaultTitle;
  }

  return seoConfig.titleTemplate.replace("%s", title);
}

function resolveDescription(description?: string): string {
  return description ?? seoConfig.defaultDescription;
}

function resolveKeywords(keywords?: readonly string[]): string[] {
  if (!keywords || keywords.length === 0) {
    return [...seoConfig.defaultKeywords];
  }

  return [...keywords];
}

function resolveCanonicalUrl(pathname = "/"): string {
  return absoluteUrl(pathname);
}

function resolveOgImage(ogImagePath?: string): string {
  const imagePath = ogImagePath ?? seoConfig.ogImagePath;
  return absoluteUrl(imagePath);
}

export function createPageMetadata({
  title,
  description,
  keywords,
  pathname = "/",
  noIndex = false,
  ogImagePath,
}: PageMetadataInput = {}): Metadata {
  const resolvedTitle = resolveTitle(title);
  const resolvedDescription = resolveDescription(description);
  const resolvedKeywords = resolveKeywords(keywords);
  const canonicalUrl = resolveCanonicalUrl(pathname);
  const ogImageUrl = resolveOgImage(ogImagePath);

  return {
    metadataBase: new URL(absoluteUrl()),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    authors: [{ name: siteConfig.author.name, url: absoluteUrl() }],
    creator: siteConfig.author.name,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.author.jobTitle}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      creator: seoConfig.twitterHandle,
      images: [ogImageUrl],
    },
  };
}

export const rootMetadata = createPageMetadata();
