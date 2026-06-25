import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/platform/error-handler";
import { requireAdminUser } from "@/lib/auth/session";
import { getMetricsSnapshot } from "@/services/platform/health.service";

export async function GET() {
  try {
    await requireAdminUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await getMetricsSnapshot();
    return NextResponse.json(metrics, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return handleApiError(error, "metrics");
  }
}
