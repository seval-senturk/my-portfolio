import { NextResponse } from "next/server";

import { runHealthChecks } from "@/services/platform/health.service";

export interface PublicHealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
}

/** Minimal health payload safe for unauthenticated production monitoring. */
export async function GET() {
  const health = await runHealthChecks();
  const body: PublicHealthResponse = {
    status: health.status,
    timestamp: health.timestamp,
  };

  const statusCode = health.status === "unhealthy" ? 503 : 200;

  return NextResponse.json(body, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
