import { NextResponse } from "next/server";

import {
  getConfiguredFaviconPath,
  getFaviconContentType,
  readConfiguredFaviconFile,
} from "@/lib/seo/favicon";

export const dynamic = "force-dynamic";

export async function GET() {
  const faviconPath = await getConfiguredFaviconPath();

  if (faviconPath.startsWith("http://") || faviconPath.startsWith("https://")) {
    return NextResponse.redirect(faviconPath);
  }

  const { buffer } = await readConfiguredFaviconFile();

  if (!buffer) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": getFaviconContentType(faviconPath),
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
