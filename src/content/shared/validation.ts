import type { MediaAsset, MediaProvider, SeoFields } from "@/content/shared/types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function assertRequired(
  value: string | undefined,
  fieldName: string,
): string | undefined {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required.`;
  }

  return undefined;
}

export function validateSlug(slug: string): string | undefined {
  const requiredError = assertRequired(slug, "Slug");

  if (requiredError) {
    return requiredError;
  }

  if (!isValidSlug(slug)) {
    return "Slug must use lowercase letters, numbers, and hyphens only.";
  }

  return undefined;
}

export function validateSeoFields(seo: SeoFields): string[] {
  const errors: string[] = [];

  if (seo.metaTitle && seo.metaTitle.length > 70) {
    errors.push("Meta title should be 70 characters or fewer.");
  }

  if (seo.metaDescription && seo.metaDescription.length > 160) {
    errors.push("Meta description should be 160 characters or fewer.");
  }

  if (seo.canonicalUrl) {
    try {
      new URL(seo.canonicalUrl);
    } catch {
      errors.push("Canonical URL must be a valid absolute URL.");
    }
  }

  return errors;
}

interface CreateMediaAssetInput {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  provider?: MediaProvider;
  publicId?: string;
}

export function createMediaAsset(input: CreateMediaAssetInput): MediaAsset {
  return {
    id: input.id,
    url: input.url,
    alt: input.alt,
    width: input.width,
    height: input.height,
    provider: input.provider ?? "local",
    publicId: input.publicId,
  };
}

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
}

export function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const transforms = [
    options.width ? `w_${options.width}` : undefined,
    options.height ? `h_${options.height}` : undefined,
    options.quality ? `q_${options.quality}` : "q_auto",
    options.format ? `f_${options.format}` : "f_auto",
  ]
    .filter(Boolean)
    .join(",");

  const transformation = transforms ? `${transforms}/` : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}${publicId}`;
}
