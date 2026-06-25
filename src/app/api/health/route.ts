import { NextResponse } from "next/server";

import { runHealthChecks } from "@/services/platform/health.service";

export async function GET() {
  const health = await runHealthChecks();
  const statusCode = health.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
