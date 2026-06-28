const PRODUCTION_REQUIRED = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const;

export function getMissingProductionEnvVars(): string[] {
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  return PRODUCTION_REQUIRED.filter((key) => {
    const value = process.env[key]?.trim();
    return !value;
  });
}

export function validateProductionEnv(): void {
  const missing = getMissingProductionEnvVars();

  if (missing.length === 0) {
    return;
  }

  throw new Error(
    `Missing required production environment variables: ${missing.join(", ")}`,
  );
}
