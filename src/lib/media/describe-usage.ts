import type { MediaUsageEntityType } from "@prisma/client";

import type { MediaUsageRecord } from "@/types/media-management";

const TYPE_LABELS: Record<MediaUsageEntityType, string> = {
  HERO: "Hero",
  BLOG_POST: "Blog",
  PROJECT: "Project",
  RESUME: "Resume",
  SEO: "SEO",
  SEO_GLOBAL: "SEO Global",
  SEO_PAGE: "SEO Page",
  BRAND: "Brand Assets",
  AI_CAREER: "AI Career",
  OTHER: "Other",
};

export function describeUsageLocation(usage: MediaUsageRecord): string {
  const typeLabel = TYPE_LABELS[usage.entityType] ?? usage.entityType;
  const detail = usage.label ?? usage.fieldName;

  return `${typeLabel} — ${detail}`;
}
