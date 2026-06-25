import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth/session";
import {
  getMediaAsset,
  getMediaSeoWarnings,
  listMediaAssets,
  patchMediaAsset,
  removeMediaAsset,
} from "@/services/admin/media.admin.service";
import type { MediaAssetType } from "@prisma/client";

export async function GET(request: Request) {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const result = await listMediaAssets({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    folderSlug: searchParams.get("folder") ?? undefined,
    assetType: (searchParams.get("assetType") as MediaAssetType | null) ?? undefined,
    sortBy: (searchParams.get("sortBy") as "uploadedAt" | "filename" | "size" | "title" | null) ?? undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc" | null) ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
  });

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string | null;
    altText?: string | null;
    caption?: string | null;
    description?: string | null;
    category?: string | null;
    tags?: string[];
    folderId?: string | null;
  };

  if (!body.id) {
    return NextResponse.json({ error: "Missing asset id." }, { status: 400 });
  }

  const asset = await patchMediaAsset(body.id, {
    title: body.title,
    altText: body.altText,
    caption: body.caption,
    description: body.description,
    category: body.category,
    tags: body.tags,
    folderId: body.folderId,
  });

  return NextResponse.json({
    asset,
    seoWarnings: getMediaSeoWarnings(asset),
  });
}

export async function DELETE(request: Request) {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing asset id." }, { status: 400 });
  }

  try {
    await removeMediaAsset(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "MEDIA_IN_USE") {
      const asset = await getMediaAsset(id);
      return NextResponse.json(
        {
          error: "Asset is in use and cannot be deleted.",
          usages: asset?.usages ?? [],
        },
        { status: 409 },
      );
    }

    throw error;
  }
}
