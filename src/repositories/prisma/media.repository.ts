import type { MediaAssetType, MediaProvider, MediaUsageEntityType, Prisma } from "@prisma/client";

import { MEDIA_FOLDER_DEFINITIONS } from "@/constants/media-folders";
import { prisma } from "@/lib/prisma";
import type {
  MediaAssetRecord,
  MediaDeleteCheck,
  MediaFolderRecord,
  MediaListQuery,
  MediaListResult,
  MediaUpdateInput,
  MediaUsageRecord,
} from "@/types/media-management";

const mediaInclude = {
  folder: true,
  usages: true,
} satisfies Prisma.MediaAssetInclude;

function mapFolder(record: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
}): MediaFolderRecord {
  return record;
}

function mapUsage(record: {
  id: string;
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
  label: string | null;
  createdAt: Date;
}): MediaUsageRecord {
  return record;
}

function mapAsset(record: Prisma.MediaAssetGetPayload<{ include: typeof mediaInclude }>): MediaAssetRecord {
  return {
    id: record.id,
    filename: record.filename,
    originalName: record.originalName,
    mimeType: record.mimeType,
    assetType: record.assetType,
    size: record.size,
    width: record.width,
    height: record.height,
    storageProvider: record.storageProvider,
    storageKey: record.storageKey,
    publicUrl: record.publicUrl,
    folderId: record.folderId,
    folder: record.folder ? mapFolder(record.folder) : null,
    category: record.category,
    title: record.title,
    altText: record.altText,
    caption: record.caption,
    description: record.description,
    tags: record.tags,
    version: record.version,
    parentAssetId: record.parentAssetId,
    isLatest: record.isLatest,
    uploadedById: record.uploadedById,
    uploadedAt: record.uploadedAt,
    updatedAt: record.updatedAt,
    usages: record.usages.map(mapUsage),
  };
}

export async function ensureMediaFolders(): Promise<void> {
  await Promise.all(
    MEDIA_FOLDER_DEFINITIONS.map((folder) =>
      prisma.mediaFolder.upsert({
        where: { slug: folder.slug },
        update: {
          name: folder.name,
          description: folder.description,
          sortOrder: folder.sortOrder,
        },
        create: folder,
      }),
    ),
  );
}

export async function findMediaFolderBySlug(slug: string): Promise<MediaFolderRecord | null> {
  const folder = await prisma.mediaFolder.findUnique({ where: { slug } });

  return folder ? mapFolder(folder) : null;
}

export async function listMediaFolders(): Promise<MediaFolderRecord[]> {
  const folders = await prisma.mediaFolder.findMany({ orderBy: { sortOrder: "asc" } });
  return folders.map(mapFolder);
}

export async function createMediaAsset(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  assetType: MediaAssetType;
  size: number;
  width?: number | null;
  height?: number | null;
  storageProvider: MediaProvider;
  storageKey: string;
  publicUrl: string;
  folderId?: string | null;
  category?: string | null;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  tags?: string[];
  version?: number;
  parentAssetId?: string | null;
  isLatest?: boolean;
  uploadedById?: string | null;
}): Promise<MediaAssetRecord> {
  const asset = await prisma.mediaAsset.create({
    data: {
      filename: data.filename,
      originalName: data.originalName,
      mimeType: data.mimeType,
      assetType: data.assetType,
      size: data.size,
      width: data.width ?? null,
      height: data.height ?? null,
      storageProvider: data.storageProvider,
      storageKey: data.storageKey,
      publicUrl: data.publicUrl,
      folderId: data.folderId ?? null,
      category: data.category ?? null,
      title: data.title ?? null,
      altText: data.altText ?? null,
      caption: data.caption ?? null,
      description: data.description ?? null,
      tags: data.tags ?? [],
      version: data.version ?? 1,
      parentAssetId: data.parentAssetId ?? null,
      isLatest: data.isLatest ?? true,
      uploadedById: data.uploadedById ?? null,
    },
    include: mediaInclude,
  });

  return mapAsset(asset);
}

export async function findMediaAssetById(id: string): Promise<MediaAssetRecord | null> {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: mediaInclude,
  });

  return asset ? mapAsset(asset) : null;
}

export async function listMediaAssets(query: MediaListQuery = {}): Promise<MediaListResult> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 24));
  const sortBy = query.sortBy ?? "uploadedAt";
  const sortOrder = query.sortOrder ?? "desc";

  const where: Prisma.MediaAssetWhereInput = {
    isLatest: true,
  };

  if (query.category) {
    where.category = query.category;
  }

  if (query.assetType) {
    where.assetType = query.assetType;
  }

  if (query.folderSlug) {
    where.folder = { slug: query.folderSlug };
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    where.OR = [
      { filename: { contains: term, mode: "insensitive" } },
      { originalName: { contains: term, mode: "insensitive" } },
      { title: { contains: term, mode: "insensitive" } },
      { altText: { contains: term, mode: "insensitive" } },
      { tags: { has: term } },
      { category: { contains: term, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      include: mediaInclude,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return {
    items: items.map(mapAsset),
    total,
    page,
    pageSize,
  };
}

export async function updateMediaAsset(id: string, input: MediaUpdateInput): Promise<MediaAssetRecord> {
  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: {
      title: input.title,
      altText: input.altText,
      caption: input.caption,
      description: input.description,
      category: input.category,
      tags: input.tags,
      folderId: input.folderId,
    },
    include: mediaInclude,
  });

  return mapAsset(asset);
}

export async function markAssetAsNotLatest(id: string): Promise<void> {
  await prisma.mediaAsset.update({
    where: { id },
    data: { isLatest: false },
  });
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await prisma.mediaAsset.delete({ where: { id } });
}

export async function getMediaDeleteCheck(id: string): Promise<MediaDeleteCheck> {
  const usages = await prisma.mediaUsage.findMany({ where: { mediaId: id } });

  return {
    canDelete: usages.length === 0,
    usages: usages.map(mapUsage),
  };
}

export async function registerMediaUsage(input: {
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
  label?: string | null;
}): Promise<MediaUsageRecord> {
  const usage = await prisma.mediaUsage.upsert({
    where: {
      mediaId_entityType_entityId_fieldName: {
        mediaId: input.mediaId,
        entityType: input.entityType,
        entityId: input.entityId,
        fieldName: input.fieldName,
      },
    },
    update: {
      label: input.label ?? null,
    },
    create: {
      mediaId: input.mediaId,
      entityType: input.entityType,
      entityId: input.entityId,
      fieldName: input.fieldName,
      label: input.label ?? null,
    },
  });

  return mapUsage(usage);
}

export async function removeMediaUsage(input: {
  mediaId: string;
  entityType: MediaUsageEntityType;
  entityId: string;
  fieldName: string;
}): Promise<void> {
  await prisma.mediaUsage.deleteMany({
    where: {
      mediaId: input.mediaId,
      entityType: input.entityType,
      entityId: input.entityId,
      fieldName: input.fieldName,
    },
  });
}

export async function listBrandAssetUsages(): Promise<MediaUsageRecord[]> {
  const usages = await prisma.mediaUsage.findMany({
    where: {
      entityType: "BRAND",
      entityId: "default",
    },
  });

  return usages.map(mapUsage);
}

export async function findMediaAssetsByIds(ids: string[]): Promise<MediaAssetRecord[]> {
  if (ids.length === 0) {
    return [];
  }

  const assets = await prisma.mediaAsset.findMany({
    where: { id: { in: ids } },
    include: mediaInclude,
  });

  return assets.map(mapAsset);
}
