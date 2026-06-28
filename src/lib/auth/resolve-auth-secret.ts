const DEV_FALLBACK_SECRET = "development-auth-secret-change-before-production";

function isProductionRuntime(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  // Next.js "Collecting page data" during build — env may be runtime-only.
  return process.env.NEXT_PHASE !== "phase-production-build";
}

/**
 * Resolves AUTH_SECRET with fail-closed behavior in production runtime.
 * Development and production build phases may use a documented fallback.
 */
export function resolveAuthSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (isProductionRuntime()) {
    throw new Error("AUTH_SECRET environment variable is required in production.");
  }

  return DEV_FALLBACK_SECRET;
}

/** Whether a real AUTH_SECRET is configured (for health checks). */
export function isAuthSecretConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET?.trim());
}
