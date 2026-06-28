import { unstable_cache } from "next/cache";

export const CACHE_TAGS = {
  content: "content",
  seo: "seo",
  settings: "settings",
  redirects: "redirects",
} as const;

/** Default ISR window for CMS-backed public content (seconds). */
export const PUBLIC_CONTENT_REVALIDATE = 300;

export function cachedQuery<T>(
  key: string,
  tags: readonly string[],
  factory: () => Promise<T>,
  revalidate = PUBLIC_CONTENT_REVALIDATE,
): Promise<T> {
  return unstable_cache(factory, [key], { tags: [...tags], revalidate })();
}

export function cacheContent<T>(
  segment: string,
  keyParts: readonly string[],
  factory: () => Promise<T>,
): Promise<T> {
  const key = `${segment}:${keyParts.join(":")}`;
  return cachedQuery(key, [CACHE_TAGS.content, segment], factory);
}
