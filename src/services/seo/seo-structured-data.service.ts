import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { ROUTES } from "@/constants/routes";
import { resolveSeoImageUrl } from "@/lib/seo/resolve-image-url";
import { absoluteUrl } from "@/lib/url";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { StructuredDataSchema } from "@/types/seo";

export async function buildGlobalStructuredData(): Promise<StructuredDataSchema[]> {
  const [globalSettings, rules] = await Promise.all([
    seoRepository.getGlobalSettings(DEFAULT_LOCALE),
    seoRepository.ensureStructuredDataRules(),
  ]);

  const enabled = new Set(
    rules.filter((rule) => rule.enabled).map((rule) => rule.schemaType),
  );

  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);
  const schemas: StructuredDataSchema[] = [];

  if (enabled.has("Person")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Person",
      name: globalSettings.defaultAuthorName || siteConfig.author.name,
      jobTitle: siteConfig.author.jobTitle,
      url: siteUrl,
      email: siteConfig.author.email,
      sameAs: socialLinks
        .filter((link) => link.platform !== "email")
        .map((link) => link.href),
    });
  }

  if (enabled.has("WebSite")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: globalSettings.siteTitle || siteConfig.name,
      url: siteUrl,
      description: globalSettings.siteDescription || siteConfig.description,
      inLanguage: globalSettings.defaultLanguage || siteConfig.language,
    });
  }

  if (enabled.has("Organization")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: globalSettings.siteTitle || siteConfig.name,
      url: siteUrl,
      description: globalSettings.siteDescription || siteConfig.description,
    } as StructuredDataSchema);
  }

  return schemas;
}

export async function buildBlogPostingStructuredData(input: {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}): Promise<StructuredDataSchema[]> {
  const globalSettings = await seoRepository.getGlobalSettings(DEFAULT_LOCALE);
  const rules = await seoRepository.ensureStructuredDataRules();
  const enabled = new Set(
    rules.filter((rule) => rule.enabled).map((rule) => rule.schemaType),
  );

  const pathname = `/blog/${input.slug}`;
  const url = absoluteUrl(pathname);
  const image = resolveSeoImageUrl(input.imageUrl, globalSettings.defaultOgImageUrl ?? undefined);
  const schemas: StructuredDataSchema[] = [];

  if (enabled.has("BlogPosting") || enabled.has("Article")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": enabled.has("BlogPosting") ? "BlogPosting" : "Article",
      headline: input.title,
      description: input.description,
      url,
      datePublished: input.publishedAt ?? input.updatedAt ?? new Date().toISOString(),
      dateModified: input.updatedAt,
      author: {
        "@type": "Person",
        name: input.authorName,
      },
      image,
    } as StructuredDataSchema);
  }

  if (enabled.has("BreadcrumbList")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl(ROUTES.home),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: absoluteUrl(ROUTES.blog),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: input.title,
          item: url,
        },
      ],
    } as StructuredDataSchema);
  }

  if (enabled.has("WebPage")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      description: input.description,
      url,
    } as StructuredDataSchema);
  }

  return schemas;
}

export async function buildProfilePageStructuredData(input: {
  title: string;
  description: string;
  pathname: string;
}): Promise<StructuredDataSchema[]> {
  const rules = await seoRepository.ensureStructuredDataRules();
  const enabled = new Set(
    rules.filter((rule) => rule.enabled).map((rule) => rule.schemaType),
  );

  if (!enabled.has("ProfilePage")) {
    return [];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: input.title,
      url: absoluteUrl(input.pathname),
      description: input.description,
      mainEntity: {
        "@type": "Person",
        name: siteConfig.author.name,
        jobTitle: siteConfig.author.jobTitle,
      },
    },
  ];
}

export async function buildAiCareerStructuredData(): Promise<StructuredDataSchema[]> {
  const [settings, rules] = await Promise.all([
    seoRepository.getAiCareerSettings(DEFAULT_LOCALE),
    seoRepository.ensureStructuredDataRules(),
  ]);

  const enabled = new Set(
    rules.filter((rule) => rule.enabled).map((rule) => rule.schemaType),
  );

  const schemas: StructuredDataSchema[] = [];

  if (enabled.has("WebPage") && settings.landingMetaTitle) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: settings.landingMetaTitle,
      description: settings.landingDescription ?? undefined,
      url: absoluteUrl("/career"),
    } as StructuredDataSchema);
  }

  if (enabled.has("FAQPage") && settings.faqSchemaJson) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      ...(settings.faqSchemaJson as object),
    } as StructuredDataSchema);
  }

  return schemas;
}
