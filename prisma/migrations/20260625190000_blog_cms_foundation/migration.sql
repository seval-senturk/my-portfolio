-- Blog CMS foundation: extended post fields and scheduled status
ALTER TYPE "ContentStatus" ADD VALUE IF NOT EXISTS 'SCHEDULED';

ALTER TABLE "BlogPost"
  ADD COLUMN IF NOT EXISTS "contentJson" JSONB,
  ADD COLUMN IF NOT EXISTS "authorName" TEXT,
  ADD COLUMN IF NOT EXISTS "readingTimeMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "coverImageAlt" TEXT,
  ADD COLUMN IF NOT EXISTS "searchText" TEXT,
  ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "BlogPost_featured_idx" ON "BlogPost"("featured");
CREATE INDEX IF NOT EXISTS "BlogPost_scheduledAt_idx" ON "BlogPost"("scheduledAt");
CREATE INDEX IF NOT EXISTS "BlogPost_createdAt_idx" ON "BlogPost"("createdAt");
