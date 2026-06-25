import type { MediaAssetType, MediaProvider, MediaUsageEntityType } from "@prisma/client";

export interface MediaFolderRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
}

export interface MediaAssetRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  assetType: MediaAssetType;
  size: number;
  width: number | null;
  height: number | null;
  storageProvider: MediaProvider;
  storageKey: string;
  publicUrl: string;
  folderId: string | null;
  folder: MediaFolderRecord | null;
  category: string | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  description: string | null;
  tags: string[];
  version: number;
  parentAssetId: string | null;
  isLatest: boolean;
  uploadedById: string | null;
  uploadedAt: Date;
  updatedAt: Date;
  usages?: MediaUsageRecord[];
}

export interface MediaUsageRecord {
  id: string;
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
  label: string | null;
  createdAt: Date;
}

export interface MediaListQuery {
  search?: string;
  category?: string;
  folderSlug?: string;
  assetType?: MediaAssetType;
  sortBy?: "uploadedAt" | "filename" | "size" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface MediaListResult {
  items: MediaAssetRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MediaUploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  category?: string;
  folderSlug?: string;
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
  tags?: string[];
  uploadedById?: string;
}

export interface MediaUpdateInput {
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  category?: string | null;
  tags?: string[];
  folderId?: string | null;
}

export interface MediaSeoWarning {
  field: string;
  message: string;
}

export interface MediaDeleteCheck {
  canDelete: boolean;
  usages: MediaUsageRecord[];
}

/** Reserved for future AI enrichment hooks — not implemented in Phase 18 */
export interface MediaAiEnrichmentHooks {
  generateAltText?: (asset: MediaAssetRecord) => Promise<string | null>;
  generateDescription?: (asset: MediaAssetRecord) => Promise<string | null>;
  generateTags?: (asset: MediaAssetRecord) => Promise<string[]>;
  suggestCategory?: (asset: MediaAssetRecord) => Promise<string | null>;
}
