import { absoluteUrl } from "@/lib/url";

export function resolveSeoImageUrl(imageUrl?: string | null, fallback?: string): string {
  const candidate = imageUrl?.trim() || fallback?.trim();
  if (!candidate) {
    return absoluteUrl("/og-image.png");
  }

  if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
    return candidate;
  }

  return absoluteUrl(candidate.startsWith("/") ? candidate : `/${candidate}`);
}
