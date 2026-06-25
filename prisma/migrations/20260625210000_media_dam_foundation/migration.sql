-- CreateEnum
CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'PDF', 'SVG', 'ICON', 'LOGO', 'DOCUMENT', 'VIDEO', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaUsageEntityType" AS ENUM ('HERO', 'BLOG_POST', 'PROJECT', 'RESUME', 'SEO', 'SEO_GLOBAL', 'SEO_PAGE', 'BRAND', 'AI_CAREER', 'OTHER');

-- CreateTable
CREATE TABLE "MediaFolder" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "assetType" "MediaAssetType" NOT NULL DEFAULT 'OTHER',
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "storageProvider" "MediaProvider" NOT NULL DEFAULT 'LOCAL',
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "folderId" TEXT,
    "category" TEXT,
    "title" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentAssetId" TEXT,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaUsage" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "entityType" "MediaUsageEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolder_slug_key" ON "MediaFolder"("slug");

-- CreateIndex
CREATE INDEX "MediaFolder_sortOrder_idx" ON "MediaFolder"("sortOrder");

-- CreateIndex
CREATE INDEX "MediaAsset_folderId_idx" ON "MediaAsset"("folderId");

-- CreateIndex
CREATE INDEX "MediaAsset_category_idx" ON "MediaAsset"("category");

-- CreateIndex
CREATE INDEX "MediaAsset_assetType_idx" ON "MediaAsset"("assetType");

-- CreateIndex
CREATE INDEX "MediaAsset_uploadedAt_idx" ON "MediaAsset"("uploadedAt");

-- CreateIndex
CREATE INDEX "MediaAsset_parentAssetId_idx" ON "MediaAsset"("parentAssetId");

-- CreateIndex
CREATE INDEX "MediaAsset_isLatest_idx" ON "MediaAsset"("isLatest");

-- CreateIndex
CREATE INDEX "MediaAsset_filename_idx" ON "MediaAsset"("filename");

-- CreateIndex
CREATE INDEX "MediaUsage_mediaId_idx" ON "MediaUsage"("mediaId");

-- CreateIndex
CREATE INDEX "MediaUsage_entityType_entityId_idx" ON "MediaUsage"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaUsage_mediaId_entityType_entityId_fieldName_key" ON "MediaUsage"("mediaId", "entityType", "entityId", "fieldName");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "MediaFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_parentAssetId_fkey" FOREIGN KEY ("parentAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaUsage" ADD CONSTRAINT "MediaUsage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
