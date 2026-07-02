import type { SeoRedirectStatusCode, TwitterCardType } from "@prisma/client";

import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import {
  parseKeywordsInput,
  sanitizeKeywords,
  sanitizeRedirectPath,
  sanitizeSeoText,
  sanitizeSeoUrl,
} from "@/lib/seo/sanitize";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import { validateSeoFields } from "@/content/shared/validation";
import type {
  SeoAiCareerSettingsRecord,
  SeoGlobalSettingsRecord,
  SeoHealthReport,
  SeoMetadataRecord,
  SeoOverviewStats,
  SeoPageRecord,
  SeoRedirectRecord,
  SeoStructuredDataRuleRecord,
} from "@/types/seo-management";

export interface SeoGlobalInput {
  siteTitle: string;
  siteDescription: string;
  defaultKeywords: string[];
  defaultAuthorName: string;
  siteUrlOverride?: string;
  defaultLanguage: string;
  defaultOgImageUrl?: string;
  defaultTwitterImageUrl?: string;
  twitterHandle?: string;
  titleTemplate: string;
  faviconPath: string;
  defaultRobotsIndex: boolean;
  defaultRobotsFollow: boolean;
}

export interface SeoPageInput {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  ogType?: string;
  twitterCardType?: TwitterCardType;
  twitterImageUrl?: string;
  keywords?: string[];
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
}

export interface SeoEntityInput extends SeoPageInput {
  seoNotes?: string;
  structuredData?: unknown;
}

export interface SeoRedirectInput {
  id?: string;
  fromPath: string;
  toPath: string;
  statusCode: SeoRedirectStatusCode;
  isActive: boolean;
  note?: string;
}

function validateSeoInput(input: {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}): string[] {
  return validateSeoFields({
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
  });
}

function sanitizePageInput(input: SeoPageInput): SeoPageInput {
  return {
    metaTitle: sanitizeSeoText(input.metaTitle, 70),
    metaDescription: sanitizeSeoText(input.metaDescription, 160),
    canonicalUrl: sanitizeSeoUrl(input.canonicalUrl),
    focusKeyword: sanitizeSeoText(input.focusKeyword, 80),
    ogTitle: sanitizeSeoText(input.ogTitle, 100),
    ogDescription: sanitizeSeoText(input.ogDescription, 200),
    ogImageUrl: sanitizeSeoUrl(input.ogImageUrl),
    ogImageAlt: sanitizeSeoText(input.ogImageAlt, 120),
    ogType: sanitizeSeoText(input.ogType, 40) ?? "website",
    twitterCardType: input.twitterCardType,
    twitterImageUrl: sanitizeSeoUrl(input.twitterImageUrl),
    keywords: sanitizeKeywords(input.keywords),
    robotsIndex: input.robotsIndex ?? null,
    robotsFollow: input.robotsFollow ?? null,
  };
}

export async function getSeoDashboardOverview(): Promise<SeoOverviewStats> {
  const { getSeoOverviewStats } = await import("@/services/seo/seo-health.service");
  return getSeoOverviewStats();
}

export async function getSeoHealthReport(): Promise<SeoHealthReport> {
  const { runSeoHealthCheck } = await import("@/services/seo/seo-health.service");
  return runSeoHealthCheck();
}

export async function getGlobalSeoSettings(): Promise<SeoGlobalSettingsRecord> {
  return seoRepository.getGlobalSettings(DEFAULT_LOCALE);
}

export async function saveGlobalSeoSettings(input: SeoGlobalInput): Promise<SeoGlobalSettingsRecord> {
  if (!input.siteTitle.trim() || !input.siteDescription.trim()) {
    throw new Error("Site title and description are required.");
  }

  return seoRepository.upsertGlobalSettings({
    locale: DEFAULT_LOCALE,
    siteTitle: sanitizeSeoText(input.siteTitle, 120) ?? "Site",
    siteDescription: sanitizeSeoText(input.siteDescription, 320) ?? "",
    defaultKeywords: sanitizeKeywords(input.defaultKeywords),
    defaultAuthorName: sanitizeSeoText(input.defaultAuthorName, 120) ?? "Author",
    siteUrlOverride: sanitizeSeoUrl(input.siteUrlOverride) ?? null,
    defaultLanguage: sanitizeSeoText(input.defaultLanguage, 10) ?? "en",
    defaultOgImageUrl: sanitizeSeoUrl(input.defaultOgImageUrl) ?? null,
    defaultTwitterImageUrl: sanitizeSeoUrl(input.defaultTwitterImageUrl) ?? null,
    twitterHandle: sanitizeSeoText(input.twitterHandle, 80) ?? null,
    titleTemplate: sanitizeSeoText(input.titleTemplate, 120) ?? "%s | %siteName%",
    faviconPath: sanitizeSeoText(input.faviconPath, 120) ?? "/icons/favicon.ico",
    defaultRobotsIndex: input.defaultRobotsIndex,
    defaultRobotsFollow: input.defaultRobotsFollow,
  });
}

export async function listSeoPages(): Promise<SeoPageRecord[]> {
  return seoRepository.ensurePageRecords(DEFAULT_LOCALE);
}

export async function saveSeoPage(pageKey: string, input: SeoPageInput): Promise<SeoPageRecord> {
  const sanitized = sanitizePageInput(input);
  const errors = validateSeoInput(sanitized);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }
  return seoRepository.upsertPage(pageKey, sanitized);
}

export async function listBlogSeoEntries() {
  const posts = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.blogPost.findMany({
      select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  );
  const seoRecords = await seoRepository.listMetadataByType(SEO_ENTITY_TYPES.BLOG_POST);
  const seoMap = new Map(seoRecords.map((record) => [record.entityId, record]));

  return posts.map((post) => ({
    ...post,
    seo: seoMap.get(post.id) ?? null,
  }));
}

export async function listProjectSeoEntries() {
  const projects = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.project.findMany({
      select: { id: true, title: true, slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    }),
  );
  const seoRecords = await seoRepository.listMetadataByType(SEO_ENTITY_TYPES.PROJECT);
  const seoMap = new Map(seoRecords.map((record) => [record.entityId, record]));

  return projects.map((project) => ({
    ...project,
    seo: seoMap.get(project.id) ?? null,
  }));
}

export async function saveEntitySeo(
  entityType: string,
  entityId: string,
  input: SeoEntityInput,
): Promise<SeoMetadataRecord> {
  const sanitized = sanitizePageInput(input);
  const errors = validateSeoInput(sanitized);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return seoRepository.upsertMetadata({
    entityType,
    entityId,
    ...sanitized,
    seoNotes: sanitizeSeoText(input.seoNotes, 2000),
    structuredData: input.structuredData as never,
  });
}

export async function getResumeSeo(): Promise<SeoMetadataRecord | null> {
  const resume = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.resume.findUnique({ where: { locale: DEFAULT_LOCALE } }),
  );
  if (!resume) return null;
  return seoRepository.getMetadata(SEO_ENTITY_TYPES.RESUME, resume.id);
}

export async function saveResumeSeo(input: SeoEntityInput): Promise<SeoMetadataRecord> {
  const resume = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.resume.findUnique({ where: { locale: DEFAULT_LOCALE } }),
  );
  if (!resume) {
    throw new Error("Resume record not found.");
  }
  return saveEntitySeo(SEO_ENTITY_TYPES.RESUME, resume.id, input);
}

export async function getAiCareerSeo(): Promise<SeoAiCareerSettingsRecord> {
  return seoRepository.getAiCareerSettings(DEFAULT_LOCALE);
}

export async function saveAiCareerSeo(
  input: Partial<SeoAiCareerSettingsRecord>,
): Promise<SeoAiCareerSettingsRecord> {
  return seoRepository.upsertAiCareerSettings({
    locale: DEFAULT_LOCALE,
    landingMetaTitle: sanitizeSeoText(input.landingMetaTitle, 70),
    landingDescription: sanitizeSeoText(input.landingDescription, 160),
    toolMetaTitle: sanitizeSeoText(input.toolMetaTitle, 70),
    toolDescription: sanitizeSeoText(input.toolDescription, 160),
    landingKeywords: sanitizeKeywords(input.landingKeywords),
    faqSchemaJson: input.faqSchemaJson,
    featureSchemaJson: input.featureSchemaJson,
    ogImageUrl: sanitizeSeoUrl(input.ogImageUrl),
  });
}

export async function listStructuredDataRules(): Promise<SeoStructuredDataRuleRecord[]> {
  return seoRepository.ensureStructuredDataRules();
}

export async function saveStructuredDataRule(
  schemaType: string,
  enabled: boolean,
): Promise<SeoStructuredDataRuleRecord> {
  return seoRepository.updateStructuredDataRule(schemaType, enabled);
}

export async function listSeoRedirects(): Promise<SeoRedirectRecord[]> {
  return seoRepository.listRedirects();
}

export async function saveSeoRedirect(input: SeoRedirectInput): Promise<SeoRedirectRecord> {
  const fromPath = sanitizeRedirectPath(input.fromPath);
  const toPath = input.toPath.startsWith("http")
    ? sanitizeSeoUrl(input.toPath) ?? input.toPath
    : sanitizeRedirectPath(input.toPath);

  if (fromPath === toPath) {
    throw new Error("Redirect source and target cannot be the same.");
  }

  return seoRepository.upsertRedirect({
    id: input.id,
    fromPath,
    toPath,
    statusCode: input.statusCode,
    isActive: input.isActive,
    note: sanitizeSeoText(input.note, 500),
  });
}

export async function deleteSeoRedirect(id: string): Promise<void> {
  await seoRepository.deleteRedirect(id);
}

export function parseSeoKeywordsFromForm(value: FormDataEntryValue | null): string[] {
  return parseKeywordsInput(typeof value === "string" ? value : undefined);
}

export async function getActiveRedirectMap(): Promise<
  Record<string, { toPath: string; statusCode: SeoRedirectStatusCode }>
> {
  const redirects = await seoRepository.listActiveRedirects();
  return Object.fromEntries(
    redirects.map((redirect) => [
      redirect.fromPath,
      { toPath: redirect.toPath, statusCode: redirect.statusCode },
    ]),
  );
}
