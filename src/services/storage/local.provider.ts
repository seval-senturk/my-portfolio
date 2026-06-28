import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import type { MediaProvider } from "@prisma/client";

import type { StorageProvider, StorageUploadInput, StorageUploadResult } from "./storage-provider.interface";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export class LocalStorageProvider implements StorageProvider {
  readonly provider: MediaProvider = "LOCAL";

  async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
    const folderPath = path.join(UPLOAD_ROOT, input.folder);
    await mkdir(folderPath, { recursive: true });

    const filePath = path.join(folderPath, input.filename);
    await writeFile(filePath, input.buffer);

    const storageKey = `${input.folder}/${input.filename}`;
    const publicUrl = `/uploads/${storageKey}`;

    return {
      storageKey,
      publicUrl,
      bytes: input.buffer.length,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = path.join(UPLOAD_ROOT, storageKey);

    try {
      await unlink(filePath);
    } catch {
      // File may already be removed
    }
  }

  getDeliveryUrl(_storageKey: string, publicUrl: string): string {
    return publicUrl;
  }
}

export const localStorageProvider = new LocalStorageProvider();
