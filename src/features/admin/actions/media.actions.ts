"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import { requireAdminUser } from "@/lib/auth/session";
import {
  assignBrandAsset,
  checkMediaDeletion,
  patchMediaAsset,
  removeMediaAsset,
} from "@/services/admin/media.admin.service";
import { trackMediaUsage, untrackMediaUsage } from "@/services/media/media-usage.service";
import type { MediaUsageEntityType } from "@prisma/client";

function revalidateMediaPaths() {
  revalidateTag(CACHE_TAGS.content);
  revalidateTag(CACHE_TAGS.seo);
  revalidatePath(ADMIN_ROUTES.media);
  revalidatePath(`${ADMIN_ROUTES.media}/brand`);
  revalidatePath("/");
}

export async function updateMediaMetadataAction(formData: FormData) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return adminError("Missing media id.");
  }

  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  try {
    await patchMediaAsset(id, {
      title: String(formData.get("title") ?? "") || null,
      altText: String(formData.get("altText") ?? "") || null,
      caption: String(formData.get("caption") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      category: String(formData.get("category") ?? "") || null,
      tags,
    });

    revalidateMediaPaths();
    await recordAudit({
      user,
      action: AuditActions.MEDIA_UPDATED,
      category: "MEDIA",
      entityType: "media_asset",
      entityId: id,
      summary: "Media metadata updated",
    });
    return adminSuccess("Media metadata updated.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed.";
    return adminError(message);
  }
}

export async function deleteMediaAction(formData: FormData) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return adminError("Missing media id.");
  }

  const check = await checkMediaDeletion(id);

  if (!check.canDelete) {
    return adminError("This asset is in use and cannot be deleted.");
  }

  try {
    await removeMediaAsset(id);
    revalidateMediaPaths();
    await recordAudit({
      user,
      action: AuditActions.MEDIA_DELETED,
      category: "MEDIA",
      entityType: "media_asset",
      entityId: id,
      summary: "Media asset deleted",
    });
    return adminSuccess("Media deleted.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed.";
    return adminError(message);
  }
}

export async function assignBrandAssetAction(formData: FormData) {
  try {
    await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const mediaId = String(formData.get("mediaId") ?? "");
  const fieldName = String(formData.get("fieldName") ?? "");
  const label = String(formData.get("label") ?? "");

  if (!mediaId || !fieldName) {
    return adminError("Missing required fields.");
  }

  try {
    await assignBrandAsset({ mediaId, fieldName, label });
    revalidateMediaPaths();
    return adminSuccess("Brand asset assigned.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assignment failed.";
    return adminError(message);
  }
}

export async function trackMediaUsageAction(formData: FormData) {
  try {
    await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const mediaId = String(formData.get("mediaId") ?? "");
  const entityType = String(formData.get("entityType") ?? "") as MediaUsageEntityType;
  const entityId = String(formData.get("entityId") ?? "");
  const fieldName = String(formData.get("fieldName") ?? "");
  const label = String(formData.get("label") ?? "") || undefined;

  if (!mediaId || !entityType || !entityId || !fieldName) {
    return adminError("Missing required fields.");
  }

  try {
    await trackMediaUsage({ mediaId, entityType, entityId, fieldName, label });
    return adminSuccess("Usage tracked.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tracking failed.";
    return adminError(message);
  }
}

export async function untrackMediaUsageAction(formData: FormData) {
  try {
    await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const mediaId = String(formData.get("mediaId") ?? "");
  const entityType = String(formData.get("entityType") ?? "") as MediaUsageEntityType;
  const entityId = String(formData.get("entityId") ?? "");
  const fieldName = String(formData.get("fieldName") ?? "");

  if (!mediaId || !entityType || !entityId || !fieldName) {
    return adminError("Missing required fields.");
  }

  try {
    await untrackMediaUsage({ mediaId, entityType, entityId, fieldName });
    return adminSuccess("Usage removed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Untrack failed.";
    return adminError(message);
  }
}
