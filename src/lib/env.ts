const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawValue: string | undefined): string {
  const trimmed = rawValue?.trim().replace(/^["']|["']$/g, "") ?? "";

  if (!trimmed) {
    return resolveFallbackSiteUrl();
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return resolveFallbackSiteUrl();
  }
}

function resolveFallbackSiteUrl(): string {
  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//i, "")}`;
  }

  return DEFAULT_SITE_URL;
}

function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
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
