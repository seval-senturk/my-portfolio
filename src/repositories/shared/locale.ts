import type { ContentQueryOptions, ContentStatus } from "@/content/shared/types";
import { ContentStatus as PrismaContentStatus } from "@prisma/client";

export const DEFAULT_LOCALE = "en";

export function resolveLocale(options?: ContentQueryOptions): string {
  return options?.locale?.trim() || DEFAULT_LOCALE;
}

export function toPrismaContentStatus(
  status?: ContentStatus,
): PrismaContentStatus {
  switch (status) {
    case "draft":
      return PrismaContentStatus.DRAFT;
    case "archived":
      return PrismaContentStatus.ARCHIVED;
    case "published":
    default:
      return PrismaContentStatus.PUBLISHED;
  }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
