const DEFAULT_SITE_URL = "http://localhost:3000";

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET;
}

export const env = {
  siteUrl: getSiteUrl(),
  authSecret: getAuthSecret(),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
