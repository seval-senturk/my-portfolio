import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth/session";
import { handleApiError } from "@/lib/platform/error-handler";
import { getMetricsSnapshot, runHealthChecks } from "@/services/platform/health.service";

export async function GET() {
  try {
    await requireAdminUser();
    const [health, metrics] = await Promise.all([runHealthChecks(), getMetricsSnapshot()]);
    return NextResponse.json({ health, metrics });
  } catch (error) {
    return handleApiError(error, "admin-health");
  }
}
