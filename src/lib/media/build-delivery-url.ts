import { env } from "@/lib/env";
import { getStorageProvider } from "@/services/storage/storage-registry";
import type { MediaProvider } from "@prisma/client";

export interface ResponsiveImageOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "scale" | "fit";
}

export interface ResponsiveSrcSetOptions {
  widths?: number[];
  format?: "auto" | "webp" | "avif";
}

const DEFAULT_RESPONSIVE_WIDTHS = [320, 640, 960, 1280, 1920];

export function buildMediaDeliveryUrl(
  storageProvider: MediaProvider,
  storageKey: string,
  publicUrl: string,
  options: ResponsiveImageOptions = {},
): string {
  if (storageProvider === "EXTERNAL") {
    return publicUrl;
  }

  const provider = getStorageProvider(storageProvider);
  return provider.getDeliveryUrl(storageKey, publicUrl, options);
}

export function buildResponsiveSrcSet(
  storageProvider: MediaProvider,
  storageKey: string,
  publicUrl: string,
  options: ResponsiveSrcSetOptions = {},
): string {
  const widths = options.widths ?? DEFAULT_RESPONSIVE_WIDTHS;

  return widths
    .map((width) => {
      const url = buildMediaDeliveryUrl(storageProvider, storageKey, publicUrl, {
        width,
        format: options.format ?? "auto",
        quality: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}

export function buildLazyImageProps(input: {
  storageProvider: MediaProvider;
  storageKey: string;
  publicUrl: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  sizes?: string;
}) {
  const src = buildMediaDeliveryUrl(input.storageProvider, input.storageKey, input.publicUrl, {
    width: input.width ?? undefined,
    format: "auto",
    quality: "auto",
  });

  const srcSet = buildResponsiveSrcSet(input.storageProvider, input.storageKey, input.publicUrl);

  return {
    src,
    srcSet,
    sizes: input.sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    alt: input.alt,
    width: input.width ?? undefined,
    height: input.height ?? undefined,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
}
