import { NextResponse } from "next/server";

import { getUserFacingErrorMessage, normalizeError, PlatformError } from "@/lib/platform/errors";
import { logger, observabilityHooks } from "@/services/platform/logger.service";

export function handleApiError(error: unknown, context?: string): NextResponse {
  const platformError = normalizeError(error);

  logger.error(platformError.message, {
    context: context ?? "api",
    metadata: {
      code: platformError.code,
      ...platformError.metadata,
    },
    error: platformError,
  });

  observabilityHooks.captureException(platformError, {
    context: context ?? "api",
    code: platformError.code,
  });

  const body: Record<string, unknown> = {
    success: false,
    error: getUserFacingErrorMessage(platformError),
  };

  if (process.env.NODE_ENV === "development" && platformError.code !== "VALIDATION") {
    body.debug = platformError.message;
  }

  return NextResponse.json(body, { status: platformError.statusCode });
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function throwPlatformError(
  code: PlatformError["code"],
  message: string,
  metadata?: Record<string, unknown>,
): never {
  throw new PlatformError(code, message, { metadata });
}
