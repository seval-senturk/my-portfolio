import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { absoluteUrl } from "@/lib/url";
import type { ArticleSchema, PersonSchema, WebSiteSchema } from "@/types/seo";

interface CreatePersonSchemaInput {
  url?: string;
  sameAs?: string[];
}

interface CreateWebSiteSchemaInput {
  url?: string;
  description?: string;
}

interface CreateArticleSchemaInput {
  headline: string;
  description: string;
  pathname: string;
  datePublished: string;
  dateModified?: string;
}

export function createPersonSchema({
  url = absoluteUrl(),
  sameAs = socialLinks
    .filter((link) => link.platform !== "email")
    .map((link) => link.href),
}: CreatePersonSchemaInput = {}): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    jobTitle: siteConfig.author.jobTitle,
    url,
    email: siteConfig.author.email,
    sameAs,
  };
}

export function createWebSiteSchema({
  url = absoluteUrl(),
  description = siteConfig.description,
}: CreateWebSiteSchemaInput = {}): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url,
    description,
    inLanguage: siteConfig.language,
  };
}

export function createArticleSchema({
  headline,
  description,
  pathname,
  datePublished,
  dateModified,
}: CreateArticleSchemaInput): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(pathname),
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
  };
}
