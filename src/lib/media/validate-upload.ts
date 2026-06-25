import type { MediaAssetType } from "@prisma/client";

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

const PDF_MIMES = new Set(["application/pdf"]);

export const MEDIA_SIZE_LIMITS = {
  image: 10 * 1024 * 1024,
  pdf: 20 * 1024 * 1024,
  svg: 2 * 1024 * 1024,
  default: 15 * 1024 * 1024,
} as const;

export interface UploadValidationResult {
  valid: boolean;
  errors: string[];
  assetType: MediaAssetType;
}

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".js",
  ".html",
  ".htm",
  ".zip",
  ".rar",
]);

export function resolveAssetType(mimeType: string, filename: string): MediaAssetType {
  const lower = filename.toLowerCase();

  if (mimeType === "image/svg+xml" || lower.endsWith(".svg")) {
    return "SVG";
  }

  if (IMAGE_MIMES.has(mimeType)) {
    if (lower.includes("icon") || lower.includes("favicon")) {
      return "ICON";
    }
    if (lower.includes("logo")) {
      return "LOGO";
    }
    return "IMAGE";
  }

  if (PDF_MIMES.has(mimeType)) {
    return "PDF";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  return "DOCUMENT";
}

export function validateUploadFile(
  mimeType: string,
  size: number,
  filename: string,
): UploadValidationResult {
  const errors: string[] = [];
  const extension = filename.includes(".")
    ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
    : "";

  if (BLOCKED_EXTENSIONS.has(extension)) {
    errors.push(`File extension ${extension} is not allowed.`);
  }

  const assetType = resolveAssetType(mimeType, filename);
  const allowed =
    IMAGE_MIMES.has(mimeType) ||
    PDF_MIMES.has(mimeType) ||
    mimeType.startsWith("video/");

  if (!allowed) {
    errors.push(`MIME type ${mimeType} is not supported.`);
  }

  let maxSize = MEDIA_SIZE_LIMITS.default;

  if (IMAGE_MIMES.has(mimeType)) {
    maxSize = mimeType === "image/svg+xml" ? MEDIA_SIZE_LIMITS.svg : MEDIA_SIZE_LIMITS.image;
  } else if (PDF_MIMES.has(mimeType)) {
    maxSize = MEDIA_SIZE_LIMITS.pdf;
  }

  if (size <= 0) {
    errors.push("File is empty.");
  } else if (size > maxSize) {
    errors.push(`File exceeds maximum size of ${Math.round(maxSize / (1024 * 1024))}MB.`);
  }

  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    errors.push("Invalid filename.");
  }

  return {
    valid: errors.length === 0,
    errors,
    assetType,
  };
}

export function getSeoWarningsForAsset(input: {
  assetType: MediaAssetType;
  altText?: string | null;
  title?: string | null;
}): string[] {
  const warnings: string[] = [];
  const isVisual = input.assetType === "IMAGE" || input.assetType === "SVG" || input.assetType === "LOGO" || input.assetType === "ICON";

  if (isVisual && !input.altText?.trim()) {
    warnings.push("Alt text is empty — required for accessibility and SEO.");
  }

  if (!input.title?.trim()) {
    warnings.push("Title is empty — recommended for search and library management.");
  }

  return warnings;
}
