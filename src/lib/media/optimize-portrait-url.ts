import { normalizeMediaUrl } from "@/lib/media/normalize-media-url";

/**
 * Ensures Cloudinary portrait URLs preserve PNG transparency and stay optimized.
 * Normalizes local upload URLs for next/image compatibility.
 */
export function optimizePortraitUrl(url: string): string {
  const normalized = normalizeMediaUrl(url);

  if (!normalized.includes("res.cloudinary.com") || !normalized.includes("/upload/")) {
    return normalized;
  }

  if (normalized.includes("f_png") || normalized.includes("fl_preserve_transparency")) {
    return normalized;
  }

  return normalized.replace(
    "/upload/",
    "/upload/f_png,q_auto:good,w_800,fl_preserve_transparency/",
  );
}
