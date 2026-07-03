import type { MediaUsageEntityType } from "@prisma/client";

import { getSeoWarningsForAsset } from "@/lib/media/validate-upload";
import {
  createMediaAsset,
  deleteMediaAsset,
  findMediaAssetById,
  findMediaFolderBySlug,
  getMediaDeleteCheck,
  listMediaAssets,
  markAssetAsNotLatest,
  updateMediaAsset,
} from "@/repositories/prisma/media.repository";
import { getMediaFolderSlug } from "@/constants/media-folders";
import { normalizeFilename } from "@/lib/media/normalize-filename";
import { validateUploadFile } from "@/lib/media/validate-upload";
import {
  getStorageProvider,
  resolveDefaultStorageProvider,
} from "@/services/storage/storage-registry";
import type {
  MediaAssetRecord,
  MediaDeleteCheck,
  MediaListQuery,
  MediaListResult,
  MediaSeoWarning,
  MediaUpdateInput,
  MediaUploadInput,
} from "@/types/media-management";

const TECH_ICON_FOLDER_SLUG = "tech-icons";

function allowsSvgUpload(folderSlug: string | undefined): boolean {
  return folderSlug === TECH_ICON_FOLDER_SLUG;
}

export async function uploadMediaAsset(input: MediaUploadInput): Promise<MediaAssetRecord> {
  const folderSlug = input.folderSlug ?? getMediaFolderSlug(input.category);
  const validation = validateUploadFile(input.mimeType, input.size, input.originalName, {
    allowSvg: allowsSvgUpload(folderSlug),
  });

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }
  const folder = await findMediaFolderBySlug(folderSlug);
  const filename = normalizeFilename(input.originalName);
  const storageProvider = resolveDefaultStorageProvider();
  const provider = getStorageProvider(storageProvider);

  const uploadResult = await provider.upload({
    buffer: input.buffer,
    filename,
    mimeType: input.mimeType,
    folder: folderSlug,
  });

  return createMediaAsset({
    filename,
    originalName: input.originalName,
    mimeType: input.mimeType,
    assetType: validation.assetType,
    size: uploadResult.bytes,
    width: uploadResult.width ?? null,
    height: uploadResult.height ?? null,
    storageProvider,
    storageKey: uploadResult.storageKey,
    publicUrl: uploadResult.publicUrl,
    folderId: folder?.id ?? null,
    category: input.category ?? null,
    title: input.title ?? null,
    altText: input.altText ?? null,
    caption: input.caption ?? null,
    description: input.description ?? null,
    tags: input.tags ?? [],
    uploadedById: input.uploadedById ?? null,
  });
}

export async function uploadMediaAssetVersion(
  parentAssetId: string,
  input: MediaUploadInput,
): Promise<MediaAssetRecord> {
  const parent = await findMediaAssetById(parentAssetId);

  if (!parent) {
    throw new Error("Parent asset not found.");
  }

  await markAssetAsNotLatest(parentAssetId);

  const folderSlug = parent.folder?.slug ?? getMediaFolderSlug(parent.category);
  const validation = validateUploadFile(input.mimeType, input.size, input.originalName, {
    allowSvg: allowsSvgUpload(folderSlug),
  });

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const filename = normalizeFilename(input.originalName);
  const provider = getStorageProvider(parent.storageProvider);

  const uploadResult = await provider.upload({
    buffer: input.buffer,
    filename,
    mimeType: input.mimeType,
    folder: folderSlug,
  });

  const rootParentId = parent.parentAssetId ?? parent.id;

  return createMediaAsset({
    filename,
    originalName: input.originalName,
    mimeType: input.mimeType,
    assetType: validation.assetType,
    size: uploadResult.bytes,
    width: uploadResult.width ?? null,
    height: uploadResult.height ?? null,
    storageProvider: parent.storageProvider,
    storageKey: uploadResult.storageKey,
    publicUrl: uploadResult.publicUrl,
    folderId: parent.folderId,
    category: input.category ?? parent.category,
    title: input.title ?? parent.title,
    altText: input.altText ?? parent.altText,
    caption: input.caption ?? parent.caption,
    description: input.description ?? parent.description,
    tags: input.tags ?? parent.tags,
    version: parent.version + 1,
    parentAssetId: rootParentId,
    isLatest: true,
    uploadedById: input.uploadedById ?? null,
  });
}

export async function getMediaAsset(id: string): Promise<MediaAssetRecord | null> {
  return findMediaAssetById(id);
}

export async function queryMediaAssets(query: MediaListQuery): Promise<MediaListResult> {
  return listMediaAssets(query);
}

export async function patchMediaAsset(id: string, input: MediaUpdateInput): Promise<MediaAssetRecord> {
  return updateMediaAsset(id, input);
}

export async function checkMediaDeletion(id: string): Promise<MediaDeleteCheck> {
  return getMediaDeleteCheck(id);
}

export async function removeMediaAsset(id: string, force = false): Promise<void> {
  const check = await getMediaDeleteCheck(id);

  if (!check.canDelete && !force) {
    throw new Error("MEDIA_IN_USE");
  }

  const asset = await findMediaAssetById(id);

  if (!asset) {
    return;
  }

  if (asset.storageProvider !== "EXTERNAL") {
    const provider = getStorageProvider(asset.storageProvider);
    await provider.delete(asset.storageKey);
  }

  await deleteMediaAsset(id);
}

export function getMediaSeoWarnings(asset: MediaAssetRecord): MediaSeoWarning[] {
  return getSeoWarningsForAsset({
    assetType: asset.assetType,
    altText: asset.altText,
    title: asset.title,
  }).map((message) => ({
    field: message.includes("Alt text") ? "altText" : "title",
    message,
  }));
}

export function formatUsageLabel(entityType: MediaUsageEntityType, fieldName: string, label?: string | null): string {
  if (label) {
    return label;
  }

  return `${entityType} · ${fieldName}`;
}

/** Future AI hooks — register implementations when AI features are enabled */
export const mediaAiEnrichmentHooks = {
  enabled: false,
} as const;
