"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import type { SeoRedirectStatusCode, TwitterCardType } from "@prisma/client";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import { adminError, adminSuccess, type AdminActionResult } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import { invalidateRedirectCache } from "@/lib/seo/redirect-middleware";
import { syncPublicRootFavicon } from "@/lib/seo/favicon";
import { requireAdminUser } from "@/lib/auth/session";
import {
  deleteSeoRedirect,
  parseSeoKeywordsFromForm,
  saveAiCareerSeo,
  saveEntitySeo,
  saveGlobalSeoSettings,
  saveResumeSeo,
  saveSeoPage,
  saveSeoRedirect,
  saveStructuredDataRule,
} from "@/services/admin/seo.admin.service";

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function getNullableBoolean(formData: FormData, key: string): boolean | null {
  const value = formData.get(key);
  if (value === "inherit") return null;
  return value === "true";
}

function revalidateSeoPaths() {
  revalidateTag(CACHE_TAGS.seo);
  revalidateTag(CACHE_TAGS.content);
  revalidateTag(CACHE_TAGS.redirects);
  revalidatePath("/", "layout");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  revalidatePath(ADMIN_ROUTES.seo);
}

export async function saveGlobalSeoAction(formData: FormData): Promise<AdminActionResult> {
  const user = await requireAdminUser();

  try {
    const faviconPath = getString(formData, "faviconPath") || "/icons/favicon.ico";

    await saveGlobalSeoSettings({
      siteTitle: getString(formData, "siteTitle"),
      siteDescription: getString(formData, "siteDescription"),
      defaultKeywords: parseSeoKeywordsFromForm(formData.get("defaultKeywords")),
      defaultAuthorName: getString(formData, "defaultAuthorName"),
      siteUrlOverride: getString(formData, "siteUrlOverride") || undefined,
      defaultLanguage: getString(formData, "defaultLanguage") || "en",
      defaultOgImageUrl: getString(formData, "defaultOgImageUrl") || undefined,
      defaultTwitterImageUrl: getString(formData, "defaultTwitterImageUrl") || undefined,
      twitterHandle: getString(formData, "twitterHandle") || undefined,
      titleTemplate: getString(formData, "titleTemplate") || "%s | %siteName%",
      faviconPath,
      defaultRobotsIndex: getBoolean(formData, "defaultRobotsIndex"),
      defaultRobotsFollow: getBoolean(formData, "defaultRobotsFollow"),
    });
    await syncPublicRootFavicon(faviconPath);
    revalidateSeoPaths();
    await recordAudit({
      user,
      action: AuditActions.SEO_GLOBAL_UPDATED,
      category: "SEO",
      summary: "Global SEO settings updated",
    });
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save global SEO.");
  }
}

export async function savePageSeoAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdminUser();
  const pageKey = getString(formData, "pageKey");
  if (!pageKey) return adminError("Page key is required.");

  try {
    await saveSeoPage(pageKey, {
      metaTitle: getString(formData, "metaTitle") || undefined,
      metaDescription: getString(formData, "metaDescription") || undefined,
      canonicalUrl: getString(formData, "canonicalUrl") || undefined,
      focusKeyword: getString(formData, "focusKeyword") || undefined,
      ogTitle: getString(formData, "ogTitle") || undefined,
      ogDescription: getString(formData, "ogDescription") || undefined,
      ogImageUrl: getString(formData, "ogImageUrl") || undefined,
      ogImageAlt: getString(formData, "ogImageAlt") || undefined,
      ogType: getString(formData, "ogType") || "website",
      twitterCardType: getString(formData, "twitterCardType") as TwitterCardType,
      twitterImageUrl: getString(formData, "twitterImageUrl") || undefined,
      keywords: parseSeoKeywordsFromForm(formData.get("keywords")),
      robotsIndex: getNullableBoolean(formData, "robotsIndex"),
      robotsFollow: getNullableBoolean(formData, "robotsFollow"),
    });
    revalidateSeoPaths();
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save page SEO.");
  }
}

export async function saveProjectSeoAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdminUser();
  const entityId = getString(formData, "entityId");
  if (!entityId) return adminError("Project ID is required.");

  try {
    await saveEntitySeo(SEO_ENTITY_TYPES.PROJECT, entityId, buildEntityInput(formData));
    revalidateSeoPaths();
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save project SEO.");
  }
}

export async function saveResumeSeoAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdminUser();

  try {
    await saveResumeSeo(buildEntityInput(formData));
    revalidateSeoPaths();
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save resume SEO.");
  }
}

export async function saveAiCareerSeoAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdminUser();

  try {
    await saveAiCareerSeo({
      landingMetaTitle: getString(formData, "landingMetaTitle") || undefined,
      landingDescription: getString(formData, "landingDescription") || undefined,
      toolMetaTitle: getString(formData, "toolMetaTitle") || undefined,
      toolDescription: getString(formData, "toolDescription") || undefined,
      landingKeywords: parseSeoKeywordsFromForm(formData.get("landingKeywords")),
      ogImageUrl: getString(formData, "ogImageUrl") || undefined,
      faqSchemaJson: parseJsonField(formData.get("faqSchemaJson")),
      featureSchemaJson: parseJsonField(formData.get("featureSchemaJson")),
    });
    revalidateSeoPaths();
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save AI Career SEO.");
  }
}

export async function saveStructuredDataRuleAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdminUser();
  const schemaType = getString(formData, "schemaType");
  if (!schemaType) return adminError("Schema type is required.");

  try {
    await saveStructuredDataRule(schemaType, getBoolean(formData, "enabled"));
    revalidateSeoPaths();
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to update structured data.");
  }
}

export async function saveRedirectAction(formData: FormData): Promise<AdminActionResult> {
  const user = await requireAdminUser();

  try {
    await saveSeoRedirect({
      id: getString(formData, "id") || undefined,
      fromPath: getString(formData, "fromPath"),
      toPath: getString(formData, "toPath"),
      statusCode: getString(formData, "statusCode") as SeoRedirectStatusCode,
      isActive: getBoolean(formData, "isActive"),
      note: getString(formData, "note") || undefined,
    });
    revalidateSeoPaths();
    invalidateRedirectCache();
    await recordAudit({
      user,
      action: AuditActions.SEO_REDIRECT_SAVED,
      category: "SEO",
      summary: "SEO redirect saved",
    });
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to save redirect.");
  }
}

export async function deleteRedirectAction(formData: FormData): Promise<AdminActionResult> {
  const user = await requireAdminUser();
  const id = getString(formData, "id");
  if (!id) return adminError("Redirect ID is required.");

  try {
    await deleteSeoRedirect(id);
    revalidateSeoPaths();
    invalidateRedirectCache();
    await recordAudit({
      user,
      action: AuditActions.SEO_REDIRECT_DELETED,
      category: "SEO",
      entityType: "seo_redirect",
      entityId: id,
      summary: "SEO redirect deleted",
    });
    return adminSuccess();
  } catch (error) {
    return adminError(error instanceof Error ? error.message : "Failed to delete redirect.");
  }
}

function buildEntityInput(formData: FormData) {
  return {
    metaTitle: getString(formData, "metaTitle") || undefined,
    metaDescription: getString(formData, "metaDescription") || undefined,
    canonicalUrl: getString(formData, "canonicalUrl") || undefined,
    focusKeyword: getString(formData, "focusKeyword") || undefined,
    ogTitle: getString(formData, "ogTitle") || undefined,
    ogDescription: getString(formData, "ogDescription") || undefined,
    ogImageUrl: getString(formData, "ogImageUrl") || undefined,
    ogImageAlt: getString(formData, "ogImageAlt") || undefined,
    ogType: getString(formData, "ogType") || undefined,
    twitterCardType: getString(formData, "twitterCardType") as TwitterCardType,
    twitterImageUrl: getString(formData, "twitterImageUrl") || undefined,
    keywords: parseSeoKeywordsFromForm(formData.get("keywords")),
    robotsIndex: getNullableBoolean(formData, "robotsIndex"),
    robotsFollow: getNullableBoolean(formData, "robotsFollow"),
    seoNotes: getString(formData, "seoNotes") || undefined,
  };
}

function parseJsonField(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return JSON.parse(value);
}
