import type { MediaUsageEntityType } from "@prisma/client";

import {
  listBrandAssetUsages,
  registerMediaUsage,
  removeMediaUsage,
} from "@/repositories/prisma/media.repository";
import type { MediaUsageRecord } from "@/types/media-management";

const BRAND_ENTITY_ID = "default";

export async function trackMediaUsage(input: {
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
  label?: string;
}): Promise<MediaUsageRecord> {
  return registerMediaUsage(input);
}

export async function untrackMediaUsage(input: {
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
}): Promise<void> {
  await removeMediaUsage(input);
}

export async function assignBrandAsset(input: {
  mediaId: string;
  fieldName: string;
  label: string;
}): Promise<MediaUsageRecord> {
  return registerMediaUsage({
    mediaId: input.mediaId,
    entityType: "BRAND",
    entityId: BRAND_ENTITY_ID,
    fieldName: input.fieldName,
    label: input.label,
  });
}

export async function getBrandAssetAssignments(): Promise<MediaUsageRecord[]> {
  return listBrandAssetUsages();
}
