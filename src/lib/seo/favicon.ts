import fs from "fs/promises";
import path from "path";

import { seoConfig } from "@/config/seo.config";
import { resolveSeoImageUrl } from "@/lib/seo/resolve-image-url";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export function resolveFaviconUrl(
  faviconPath: string | null | undefined,
  version?: number | string | Date,
): string {
  const base = resolveSeoImageUrl(faviconPath, seoConfig.faviconPath);
  const versionValue =
    version instanceof Date ? version.getTime() : version !== undefined ? String(version) : undefined;

  if (!versionValue) {
    return base;
  }

  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}v=${versionValue}`;
}

export function getFaviconContentType(filePath: string): string {
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".svg")) {
    return "image/svg+xml";
  }

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".webp")) {
    return "image/webp";
  }

  return "image/x-icon";
}

export async function getConfiguredFaviconPath(locale = DEFAULT_LOCALE): Promise<string> {
  const settings = await seoRepository.getGlobalSettings(locale);
  return settings.faviconPath || seoConfig.faviconPath;
}

export async function readConfiguredFaviconFile(locale = DEFAULT_LOCALE) {
  const faviconPath = await getConfiguredFaviconPath(locale);

  if (faviconPath.startsWith("http://") || faviconPath.startsWith("https://")) {
    return { faviconPath, buffer: null as Buffer | null };
  }

  const normalized = faviconPath.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", normalized);

  try {
    const buffer = await fs.readFile(filePath);
    return { faviconPath, buffer };
  } catch {
    return { faviconPath, buffer: null as Buffer | null };
  }
}

export async function syncPublicRootFavicon(faviconPath: string): Promise<void> {
  if (faviconPath.startsWith("http://") || faviconPath.startsWith("https://")) {
    return;
  }

  const normalized = faviconPath.replace(/^\//, "");
  const sourcePath = path.join(process.cwd(), "public", normalized);
  const targetPath = path.join(process.cwd(), "public", "favicon.ico");

  try {
    await fs.copyFile(sourcePath, targetPath);
  } catch {
    // Ignore missing source files; API route will still serve configured path.
  }
}
