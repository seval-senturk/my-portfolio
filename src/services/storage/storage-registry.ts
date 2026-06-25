import type { MediaProvider } from "@prisma/client";

import { env } from "@/lib/env";

import { cloudinaryStorageProvider } from "./cloudinary.provider";
import { localStorageProvider } from "./local.provider";
import type { StorageProvider } from "./storage-provider.interface";

const providers: Record<MediaProvider, StorageProvider> = {
  LOCAL: localStorageProvider,
  CLOUDINARY: cloudinaryStorageProvider,
  EXTERNAL: {
    provider: "EXTERNAL",
    async upload() {
      throw new Error("EXTERNAL provider does not support uploads.");
    },
    async delete() {
      // External assets are not deleted from remote storage
    },
    getDeliveryUrl(_storageKey, publicUrl) {
      return publicUrl;
    },
  },
};

export function resolveDefaultStorageProvider(): MediaProvider {
  if (env.cloudinary.configured) {
    return "CLOUDINARY";
  }

  return "LOCAL";
}

export function getStorageProvider(provider?: MediaProvider): StorageProvider {
  const resolved = provider ?? resolveDefaultStorageProvider();
  return providers[resolved];
}
