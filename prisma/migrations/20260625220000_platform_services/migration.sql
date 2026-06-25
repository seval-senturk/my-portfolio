-- CreateEnum
CREATE TYPE "AuditActionCategory" AS ENUM ('CONTENT', 'SEO', 'MEDIA', 'AUTH', 'SETTINGS', 'SYSTEM');

-- CreateTable
CREATE TABLE "ApplicationSettings" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "featureFlags" JSONB NOT NULL DEFAULT '{}',
    "branding" JSONB NOT NULL DEFAULT '{}',
    "notificationPrefs" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "category" "AuditActionCategory" NOT NULL DEFAULT 'SYSTEM',
    "entityType" TEXT,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationSettings_locale_key" ON "ApplicationSettings"("locale");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_category_idx" ON "AuditLog"("category");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
