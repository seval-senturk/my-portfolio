-- CreateEnum
CREATE TYPE "SeoRedirectStatusCode" AS ENUM ('PERMANENT_301', 'TEMPORARY_302', 'TEMPORARY_307', 'PERMANENT_308');

-- CreateEnum
CREATE TYPE "TwitterCardType" AS ENUM ('SUMMARY', 'SUMMARY_LARGE_IMAGE');

-- CreateTable
CREATE TABLE "SeoGlobalSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "siteTitle" TEXT NOT NULL,
    "siteDescription" TEXT NOT NULL,
    "defaultKeywords" TEXT[],
    "defaultAuthorName" TEXT NOT NULL,
    "siteUrlOverride" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
    "defaultOgImageUrl" TEXT,
    "defaultTwitterImageUrl" TEXT,
    "twitterHandle" TEXT,
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | %siteName%',
    "faviconPath" TEXT NOT NULL DEFAULT '/favicon.ico',
    "defaultRobotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "defaultRobotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoGlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoPage" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "pageKey" TEXT NOT NULL,
    "routePath" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "focusKeyword" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImageUrl" TEXT,
    "ogImageAlt" TEXT,
    "ogType" TEXT NOT NULL DEFAULT 'website',
    "twitterCardType" "TwitterCardType" NOT NULL DEFAULT 'SUMMARY_LARGE_IMAGE',
    "twitterImageUrl" TEXT,
    "keywords" TEXT[],
    "robotsIndex" BOOLEAN,
    "robotsFollow" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoRedirect" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" "SeoRedirectStatusCode" NOT NULL DEFAULT 'PERMANENT_301',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoStructuredDataRule" (
    "id" TEXT NOT NULL,
    "schemaType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "scope" TEXT NOT NULL DEFAULT 'global',
    "configJson" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoStructuredDataRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoAiCareerSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "landingMetaTitle" TEXT,
    "landingDescription" TEXT,
    "toolMetaTitle" TEXT,
    "toolDescription" TEXT,
    "landingKeywords" TEXT[],
    "faqSchemaJson" JSONB,
    "featureSchemaJson" JSONB,
    "ogImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoAiCareerSettings_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "SeoMetadata" ADD COLUMN "focusKeyword" TEXT,
ADD COLUMN "seoNotes" TEXT,
ADD COLUMN "ogTitle" TEXT,
ADD COLUMN "ogDescription" TEXT,
ADD COLUMN "ogType" TEXT,
ADD COLUMN "twitterImageUrl" TEXT,
ADD COLUMN "twitterCardType" "TwitterCardType",
ADD COLUMN "robotsIndex" BOOLEAN,
ADD COLUMN "robotsFollow" BOOLEAN,
ADD COLUMN "structuredData" JSONB,
ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE UNIQUE INDEX "SeoGlobalSettings_locale_key" ON "SeoGlobalSettings"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "SeoPage_locale_pageKey_key" ON "SeoPage"("locale", "pageKey");

-- CreateIndex
CREATE INDEX "SeoPage_routePath_idx" ON "SeoPage"("routePath");

-- CreateIndex
CREATE UNIQUE INDEX "SeoRedirect_fromPath_key" ON "SeoRedirect"("fromPath");

-- CreateIndex
CREATE INDEX "SeoRedirect_isActive_idx" ON "SeoRedirect"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SeoStructuredDataRule_schemaType_scope_key" ON "SeoStructuredDataRule"("schemaType", "scope");

-- CreateIndex
CREATE INDEX "SeoStructuredDataRule_enabled_sortOrder_idx" ON "SeoStructuredDataRule"("enabled", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SeoAiCareerSettings_locale_key" ON "SeoAiCareerSettings"("locale");
