import type { TwitterCardType, SeoRedirectStatusCode } from "@prisma/client";

export interface SeoRobotsDirective {
  index: boolean;
  follow: boolean;
}

export interface SeoGlobalSettingsRecord {
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
  updatedAt: Date;
}

export interface SeoPageRecord {
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
}

export interface SeoMetadataRecord {
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
  structuredData: unknown;
  locale: string;
}

export interface SeoRedirectRecord {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: SeoRedirectStatusCode;
  isActive: boolean;
  note: string | null;
}

export interface SeoStructuredDataRuleRecord {
  id: string;
  schemaType: string;
  label: string;
  enabled: boolean;
  scope: string;
  configJson: unknown;
  sortOrder: number;
}

export interface SeoAiCareerSettingsRecord {
  id: string;
  locale: string;
  landingMetaTitle: string | null;
  landingDescription: string | null;
  toolMetaTitle: string | null;
  toolDescription: string | null;
  landingKeywords: string[];
  faqSchemaJson: unknown;
  featureSchemaJson: unknown;
  ogImageUrl: string | null;
}

export interface ResolvedSeoMetadata {
  title?: string;
  description?: string;
  keywords?: readonly string[];
  pathname: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article" | "profile";
  twitterCardType?: "summary" | "summary_large_image";
  twitterImageUrl?: string;
  twitterHandle?: string;
  faviconPath?: string;
  authorName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  robots?: SeoRobotsDirective;
}

export type SeoHealthIssueSeverity = "error" | "warning";

export interface SeoHealthIssue {
  id: string;
  severity: SeoHealthIssueSeverity;
  category:
    | "missing_title"
    | "missing_description"
    | "missing_og_image"
    | "missing_alt"
    | "duplicate_title"
    | "duplicate_description"
    | "broken_canonical"
    | "broken_redirect";
  message: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  fixHref?: string;
}

export interface SeoHealthReport {
  score: number;
  issueCount: number;
  issues: SeoHealthIssue[];
}

export interface SeoOverviewStats {
  pageCount: number;
  blogPostCount: number;
  projectCount: number;
  redirectCount: number;
  healthScore: number;
  issueCount: number;
}

/** Architecture hook for future AI SEO features — not implemented in Phase 17. */
export interface AiSeoCapabilityFlags {
  metaTitleGeneration: boolean;
  metaDescriptionGeneration: boolean;
  faqGeneration: boolean;
  internalLinkSuggestions: boolean;
  seoScore: boolean;
  contentOptimization: boolean;
}

export const AI_SEO_CAPABILITIES: AiSeoCapabilityFlags = {
  metaTitleGeneration: false,
  metaDescriptionGeneration: false,
  faqGeneration: false,
  internalLinkSuggestions: false,
  seoScore: false,
  contentOptimization: false,
};

/** Architecture hook for future internal linking engine. */
export interface InternalLinkSuggestion {
  sourceEntityType: string;
  sourceEntityId: string;
  targetUrl: string;
  anchorText: string;
  relevanceScore: number;
}
