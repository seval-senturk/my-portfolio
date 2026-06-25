import {
  ensureMediaFolders,
  findMediaAssetsByIds,
  listMediaFolders,
} from "@/repositories/prisma/media.repository";
import {
  checkMediaDeletion,
  getMediaAsset,
  getMediaSeoWarnings,
  patchMediaAsset,
  queryMediaAssets,
  removeMediaAsset,
  uploadMediaAsset,
  uploadMediaAssetVersion,
} from "@/services/media/media.service";
import { assignBrandAsset, getBrandAssetAssignments } from "@/services/media/media-usage.service";
import type { MediaListQuery, MediaUpdateInput, MediaUploadInput } from "@/types/media-management";

export async function bootstrapMediaLibrary(): Promise<void> {
  await ensureMediaFolders();
}

export async function getMediaLibraryOverview(query: MediaListQuery = {}) {
  await ensureMediaFolders();

  const [folders, assets, brandAssignments] = await Promise.all([
    listMediaFolders(),
    queryMediaAssets(query),
    getBrandAssetAssignments(),
  ]);

  const brandMediaIds = brandAssignments.map((usage) => usage.mediaId);
  const brandAssets = await findMediaAssetsByIds(brandMediaIds);

  return {
    folders,
    assets,
    brandAssignments,
    brandAssets,
  };
}

export {
  assignBrandAsset,
  checkMediaDeletion,
  getBrandAssetAssignments,
  getMediaAsset,
  getMediaSeoWarnings,
  queryMediaAssets as listMediaAssets,
  patchMediaAsset,
  removeMediaAsset,
  uploadMediaAsset,
  uploadMediaAssetVersion,
};

export type { MediaListQuery, MediaUpdateInput, MediaUploadInput };
