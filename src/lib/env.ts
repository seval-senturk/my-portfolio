const DEFAULT_SITE_URL = "http://localhost:3000";

function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export const env = {
  siteUrl: getSiteUrl(),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
