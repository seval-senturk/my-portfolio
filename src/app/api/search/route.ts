import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/platform/error-handler";
import { searchContent } from "@/services/platform/search.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const typesParam = searchParams.get("types");
    const types = typesParam
      ? (typesParam.split(",").filter(Boolean) as Array<"blog" | "project" | "experience">)
      : undefined;

    const results = await searchContent({ q, types, limit: 15 });

    return NextResponse.json({ results });
  } catch (error) {
    return handleApiError(error, "search");
  }
}
