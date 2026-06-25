import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth/session";
import { uploadMediaAsset, uploadMediaAssetVersion } from "@/services/admin/media.admin.service";

export async function POST(request: Request) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parentAssetId = formData.get("parentAssetId");
  const tagsRaw = formData.get("tags");

  const uploadInput = {
    buffer,
    originalName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    category: String(formData.get("category") ?? "") || undefined,
    folderSlug: String(formData.get("folderSlug") ?? "") || undefined,
    title: String(formData.get("title") ?? "") || undefined,
    altText: String(formData.get("altText") ?? "") || undefined,
    caption: String(formData.get("caption") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    tags: tagsRaw ? String(tagsRaw).split(",").map((tag) => tag.trim()).filter(Boolean) : undefined,
    uploadedById: user.id || undefined,
  };

  try {
    const asset =
      typeof parentAssetId === "string" && parentAssetId
        ? await uploadMediaAssetVersion(parentAssetId, uploadInput)
        : await uploadMediaAsset(uploadInput);

    return NextResponse.json({ asset });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
