import type { MediaProvider } from "@prisma/client";

import type { ResponsiveImageOptions } from "@/lib/media/build-delivery-url";

export interface StorageUploadInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  folder: string;
}

export interface StorageUploadResult {
  storageKey: string;
  publicUrl: string;
  width?: number;
  height?: number;
  bytes: number;
}

export interface StorageProvider {
  readonly provider: MediaProvider;
  upload(input: StorageUploadInput): Promise<StorageUploadResult>;
  delete(storageKey: string): Promise<void>;
  getDeliveryUrl(
    storageKey: string,
    publicUrl: string,
    options?: ResponsiveImageOptions,
  ): string;
}
