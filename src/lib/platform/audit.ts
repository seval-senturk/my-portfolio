import type { AuditActionCategory } from "@/types/platform";

import { createAuditLog } from "@/repositories/prisma/audit.repository";
import { logger } from "@/services/platform/logger.service";
import type { AuthUser } from "@/types/auth";

export interface AuditContext {
  user?: AuthUser | null;
  action: string;
  summary: string;
  category?: AuditActionCategory;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function recordAudit(context: AuditContext): Promise<void> {
  try {
    await createAuditLog({
      userId: context.user?.id ?? null,
      userEmail: context.user?.email ?? null,
      action: context.action,
      category: context.category ?? "SYSTEM",
      entityType: context.entityType,
      entityId: context.entityId,
      summary: context.summary,
      metadata: context.metadata,
    });
  } catch (error) {
    logger.error("Failed to write audit log", {
      context: "audit",
      metadata: { action: context.action, summary: context.summary },
      error: error instanceof Error ? error : undefined,
    });
  }
}

export const AuditActions = {
  HERO_UPDATED: "hero.updated",
  ABOUT_UPDATED: "about.updated",
  RESUME_UPDATED: "resume.updated",
  EXPERIENCE_CREATED: "experience.created",
  EXPERIENCE_UPDATED: "experience.updated",
  EXPERIENCE_DELETED: "experience.deleted",
  PROJECT_CREATED: "project.created",
  PROJECT_UPDATED: "project.updated",
  PROJECT_DELETED: "project.deleted",
  SKILL_CREATED: "skill.created",
  SKILL_UPDATED: "skill.updated",
  SKILL_DELETED: "skill.deleted",
  BLOG_POST_SAVED: "blog.post.saved",
  BLOG_POST_DELETED: "blog.post.deleted",
  BLOG_CATEGORY_SAVED: "blog.category.saved",
  BLOG_TAG_SAVED: "blog.tag.saved",
  SEO_GLOBAL_UPDATED: "seo.global.updated",
  SEO_PAGE_UPDATED: "seo.page.updated",
  SEO_REDIRECT_SAVED: "seo.redirect.saved",
  SEO_REDIRECT_DELETED: "seo.redirect.deleted",
  MEDIA_UPDATED: "media.updated",
  MEDIA_DELETED: "media.deleted",
  SETTINGS_UPDATED: "settings.updated",
  FEATURE_FLAGS_UPDATED: "featureFlags.updated",
  AUTH_PASSWORD_RESET: "auth.password.reset",
} as const;
