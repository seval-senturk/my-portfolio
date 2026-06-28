import { env } from "@/lib/env";

/**
 * Converts same-origin absolute media URLs to root-relative paths so `next/image`
 * works without extra remotePatterns (e.g. local dev uploads at /uploads/...).
 */
export function normalizeMediaUrl(url: string): string {
  if (!url || !url.startsWith("http")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const siteOrigin = new URL(env.siteUrl).origin;

    if (parsed.origin === siteOrigin && parsed.pathname.startsWith("/uploads/")) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return url;
  }

  return url;
}
