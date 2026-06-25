import type {
  Prisma,
  SeoRedirectStatusCode,
  TwitterCardType,
} from "@prisma/client";

import {
  SEO_PAGE_DEFINITIONS,
  STRUCTURED_DATA_SCHEMA_TYPES,
} from "@/constants/seo-pages";
import { seoConfig } from "@/config/seo.config";
import { siteConfig } from "@/config/site.config";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type {
  SeoAiCareerSettingsRecord,
  SeoGlobalSettingsRecord,
  SeoMetadataRecord,
  SeoPageRecord,
  SeoRedirectRecord,
  SeoStructuredDataRuleRecord,
} from "@/types/seo-management";

const DEFAULT_GLOBAL_ID = "default";
const DEFAULT_AI_CAREER_ID = "default";

function mapGlobal(record: {
  id: string;
  locale: string;
  siteTitle: string;
  siteDescription: string;
  defaultKeywords: string[];
  defaultAuthorName: string;
  siteUrlOverride: string | null;
  defaultLanguage: string;
  defaultOgImageUrl: string | null;
  defaultTwitterImageUrl: string | null;
  twitterHandle: string | null;
  titleTemplate: string;
  faviconPath: string;
  defaultRobotsIndex: boolean;
  defaultRobotsFollow: boolean;
}): SeoGlobalSettingsRecord {
  return record;
}

function mapPage(record: {
  id: string;
  locale: string;
  pageKey: string;
  routePath: string;
  label: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  ogType: string;
  twitterCardType: TwitterCardType;
  twitterImageUrl: string | null;
  keywords: string[];
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
}): SeoPageRecord {
  return record;
}

function mapMetadata(record: {
  id: string;
  entityType: string;
  entityId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  seoNotes: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  ogType: string | null;
  twitterImageUrl: string | null;
  twitterCardType: TwitterCardType | null;
  keywords: string[];
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
  structuredData: Prisma.JsonValue;
  locale: string;
}): SeoMetadataRecord {
  return {
    ...record,
    structuredData: record.structuredData ?? null,
  };
}

export class SeoRepository {
  async getGlobalSettings(locale = DEFAULT_LOCALE): Promise<SeoGlobalSettingsRecord> {
    const saved = await prisma.seoGlobalSettings.upsert({
      where: { locale },
      create: {
        id: DEFAULT_GLOBAL_ID,
        locale,
        siteTitle: siteConfig.title,
        siteDescription: siteConfig.description,
        defaultKeywords: [...seoConfig.defaultKeywords],
        defaultAuthorName: siteConfig.author.name,
        defaultLanguage: siteConfig.language,
        defaultOgImageUrl: seoConfig.ogImagePath,
        defaultTwitterImageUrl: seoConfig.ogImagePath,
        twitterHandle: seoConfig.twitterHandle,
        titleTemplate: seoConfig.titleTemplate,
        faviconPath: seoConfig.faviconPath,
      },
      update: {},
    });

    return mapGlobal(saved);
  }

  async upsertGlobalSettings(
    data: Omit<SeoGlobalSettingsRecord, "id"> & { id?: string },
  ): Promise<SeoGlobalSettingsRecord> {
    const saved = await prisma.seoGlobalSettings.upsert({
      where: { locale: data.locale },
      create: {
        id: data.id ?? DEFAULT_GLOBAL_ID,
        locale: data.locale,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        defaultKeywords: data.defaultKeywords,
        defaultAuthorName: data.defaultAuthorName,
        siteUrlOverride: data.siteUrlOverride,
        defaultLanguage: data.defaultLanguage,
        defaultOgImageUrl: data.defaultOgImageUrl,
        defaultTwitterImageUrl: data.defaultTwitterImageUrl,
        twitterHandle: data.twitterHandle,
        titleTemplate: data.titleTemplate,
        faviconPath: data.faviconPath,
        defaultRobotsIndex: data.defaultRobotsIndex,
        defaultRobotsFollow: data.defaultRobotsFollow,
      },
      update: {
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        defaultKeywords: data.defaultKeywords,
        defaultAuthorName: data.defaultAuthorName,
        siteUrlOverride: data.siteUrlOverride,
        defaultLanguage: data.defaultLanguage,
        defaultOgImageUrl: data.defaultOgImageUrl,
        defaultTwitterImageUrl: data.defaultTwitterImageUrl,
        twitterHandle: data.twitterHandle,
        titleTemplate: data.titleTemplate,
        faviconPath: data.faviconPath,
        defaultRobotsIndex: data.defaultRobotsIndex,
        defaultRobotsFollow: data.defaultRobotsFollow,
      },
    });

    return mapGlobal(saved);
  }

  async ensurePageRecords(locale = DEFAULT_LOCALE): Promise<SeoPageRecord[]> {
    for (const definition of SEO_PAGE_DEFINITIONS) {
      await prisma.seoPage.upsert({
        where: {
          locale_pageKey: { locale, pageKey: definition.pageKey },
        },
        create: {
          locale,
          pageKey: definition.pageKey,
          routePath: definition.routePath,
          label: definition.label,
          keywords: [],
        },
        update: {
          routePath: definition.routePath,
          label: definition.label,
        },
      });
    }

    const pages = await prisma.seoPage.findMany({
      where: { locale },
      orderBy: { pageKey: "asc" },
    });

    return pages.map(mapPage);
  }

  async getPageByKey(pageKey: string, locale = DEFAULT_LOCALE): Promise<SeoPageRecord | null> {
    await this.ensurePageRecords(locale);
    const page = await prisma.seoPage.findUnique({
      where: { locale_pageKey: { locale, pageKey } },
    });
    return page ? mapPage(page) : null;
  }

  async upsertPage(
    pageKey: string,
    data: Partial<Omit<SeoPageRecord, "id" | "pageKey" | "locale">> & {
      locale?: string;
    },
  ): Promise<SeoPageRecord> {
    const locale = data.locale ?? DEFAULT_LOCALE;
    await this.ensurePageRecords(locale);
    const definition = SEO_PAGE_DEFINITIONS.find((item) => item.pageKey === pageKey);
    if (!definition) {
      throw new Error(`Unknown SEO page key: ${pageKey}`);
    }

    const saved = await prisma.seoPage.update({
      where: { locale_pageKey: { locale, pageKey } },
      data: {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonicalUrl: data.canonicalUrl,
        focusKeyword: data.focusKeyword,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImageUrl: data.ogImageUrl,
        ogImageAlt: data.ogImageAlt,
        ogType: data.ogType,
        twitterCardType: data.twitterCardType,
        twitterImageUrl: data.twitterImageUrl,
        keywords: data.keywords,
        robotsIndex: data.robotsIndex,
        robotsFollow: data.robotsFollow,
      },
    });

    return mapPage(saved);
  }

  async getMetadata(entityType: string, entityId: string): Promise<SeoMetadataRecord | null> {
    const record = await prisma.seoMetadata.findUnique({
      where: { entityType_entityId: { entityType, entityId } },
    });
    return record ? mapMetadata(record) : null;
  }

  async listMetadataByType(entityType: string): Promise<SeoMetadataRecord[]> {
    const records = await prisma.seoMetadata.findMany({
      where: { entityType },
      orderBy: { updatedAt: "desc" },
    });
    return records.map(mapMetadata);
  }

  async upsertMetadata(input: {
    entityType: string;
    entityId: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    focusKeyword?: string | null;
    seoNotes?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImageUrl?: string | null;
    ogImageAlt?: string | null;
    ogType?: string | null;
    twitterImageUrl?: string | null;
    twitterCardType?: TwitterCardType | null;
    keywords?: string[];
    robotsIndex?: boolean | null;
    robotsFollow?: boolean | null;
    structuredData?: Prisma.InputJsonValue;
    locale?: string;
  }): Promise<SeoMetadataRecord> {
    const saved = await prisma.seoMetadata.upsert({
      where: {
        entityType_entityId: {
          entityType: input.entityType,
          entityId: input.entityId,
        },
      },
      create: {
        entityType: input.entityType,
        entityId: input.entityId,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl,
        focusKeyword: input.focusKeyword,
        seoNotes: input.seoNotes,
        ogTitle: input.ogTitle,
        ogDescription: input.ogDescription,
        ogImageUrl: input.ogImageUrl,
        ogImageAlt: input.ogImageAlt,
        ogType: input.ogType,
        twitterImageUrl: input.twitterImageUrl,
        twitterCardType: input.twitterCardType,
        keywords: input.keywords ?? [],
        robotsIndex: input.robotsIndex,
        robotsFollow: input.robotsFollow,
        structuredData: input.structuredData,
        locale: input.locale ?? DEFAULT_LOCALE,
      },
      update: {
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl,
        focusKeyword: input.focusKeyword,
        seoNotes: input.seoNotes,
        ogTitle: input.ogTitle,
        ogDescription: input.ogDescription,
        ogImageUrl: input.ogImageUrl,
        ogImageAlt: input.ogImageAlt,
        ogType: input.ogType,
        twitterImageUrl: input.twitterImageUrl,
        twitterCardType: input.twitterCardType,
        keywords: input.keywords ?? [],
        robotsIndex: input.robotsIndex,
        robotsFollow: input.robotsFollow,
        structuredData: input.structuredData,
        locale: input.locale ?? DEFAULT_LOCALE,
      },
    });

    return mapMetadata(saved);
  }

  async listRedirects(): Promise<SeoRedirectRecord[]> {
    return prisma.seoRedirect.findMany({ orderBy: { fromPath: "asc" } });
  }

  async listActiveRedirects(): Promise<SeoRedirectRecord[]> {
    return prisma.seoRedirect.findMany({
      where: { isActive: true },
      orderBy: { fromPath: "asc" },
    });
  }

  async upsertRedirect(input: {
    id?: string;
    fromPath: string;
    toPath: string;
    statusCode: SeoRedirectStatusCode;
    isActive: boolean;
    note?: string | null;
  }): Promise<SeoRedirectRecord> {
    if (input.id) {
      return prisma.seoRedirect.update({
        where: { id: input.id },
        data: {
          fromPath: input.fromPath,
          toPath: input.toPath,
          statusCode: input.statusCode,
          isActive: input.isActive,
          note: input.note,
        },
      });
    }

    return prisma.seoRedirect.create({
      data: {
        fromPath: input.fromPath,
        toPath: input.toPath,
        statusCode: input.statusCode,
        isActive: input.isActive,
        note: input.note,
      },
    });
  }

  async deleteRedirect(id: string): Promise<void> {
    await prisma.seoRedirect.delete({ where: { id } });
  }

  async ensureStructuredDataRules(): Promise<SeoStructuredDataRuleRecord[]> {
    for (const [index, schemaType] of STRUCTURED_DATA_SCHEMA_TYPES.entries()) {
      await prisma.seoStructuredDataRule.upsert({
        where: { schemaType_scope: { schemaType, scope: "global" } },
        create: {
          schemaType,
          label: schemaType,
          enabled: ["Person", "WebSite", "BlogPosting", "BreadcrumbList", "WebPage"].includes(
            schemaType,
          ),
          scope: "global",
          sortOrder: index,
        },
        update: {
          label: schemaType,
          sortOrder: index,
        },
      });
    }

    return prisma.seoStructuredDataRule.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async updateStructuredDataRule(
    schemaType: string,
    enabled: boolean,
  ): Promise<SeoStructuredDataRuleRecord> {
    await this.ensureStructuredDataRules();
    return prisma.seoStructuredDataRule.update({
      where: { schemaType_scope: { schemaType, scope: "global" } },
      data: { enabled },
    });
  }

  async getAiCareerSettings(locale = DEFAULT_LOCALE): Promise<SeoAiCareerSettingsRecord> {
    return prisma.seoAiCareerSettings.upsert({
      where: { locale },
      create: {
        id: DEFAULT_AI_CAREER_ID,
        locale,
        landingKeywords: [],
      },
      update: {},
    });
  }

  async upsertAiCareerSettings(
    data: Partial<Omit<SeoAiCareerSettingsRecord, "id" | "locale">> & { locale?: string },
  ): Promise<SeoAiCareerSettingsRecord> {
    const locale = data.locale ?? DEFAULT_LOCALE;
    return prisma.seoAiCareerSettings.upsert({
      where: { locale },
      create: {
        id: DEFAULT_AI_CAREER_ID,
        locale,
        landingMetaTitle: data.landingMetaTitle,
        landingDescription: data.landingDescription,
        toolMetaTitle: data.toolMetaTitle,
        toolDescription: data.toolDescription,
        landingKeywords: data.landingKeywords ?? [],
        faqSchemaJson: data.faqSchemaJson as Prisma.InputJsonValue,
        featureSchemaJson: data.featureSchemaJson as Prisma.InputJsonValue,
        ogImageUrl: data.ogImageUrl,
      },
      update: {
        landingMetaTitle: data.landingMetaTitle,
        landingDescription: data.landingDescription,
        toolMetaTitle: data.toolMetaTitle,
        toolDescription: data.toolDescription,
        landingKeywords: data.landingKeywords ?? [],
        faqSchemaJson: data.faqSchemaJson as Prisma.InputJsonValue,
        featureSchemaJson: data.featureSchemaJson as Prisma.InputJsonValue,
        ogImageUrl: data.ogImageUrl,
      },
    });
  }

  resolveSiteUrl(global: SeoGlobalSettingsRecord): string {
    return global.siteUrlOverride?.trim() || env.siteUrl;
  }
}

export const seoRepository = new SeoRepository();
