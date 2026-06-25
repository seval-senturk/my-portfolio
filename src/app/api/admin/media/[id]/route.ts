import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth/session";
import { getMediaAsset, getMediaSeoWarnings } from "@/services/admin/media.admin.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const asset = await getMediaAsset(id);

  if (!asset) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({
    asset,
    seoWarnings: getMediaSeoWarnings(asset),
  });
}
