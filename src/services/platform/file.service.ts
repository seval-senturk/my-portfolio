import {
  getMediaAsset,
  removeMediaAsset,
  uploadMediaAsset,
} from "@/services/media/media.service";
import type { MediaUploadInput } from "@/types/media-management";

/** Unified file operations facade — delegates to Media Service (Phase 18) */
export const fileService = {
  upload: (input: MediaUploadInput) => uploadMediaAsset(input),
  get: (id: string) => getMediaAsset(id),
  delete: (id: string, force?: boolean) => removeMediaAsset(id, force),
};

export type FileService = typeof fileService;
