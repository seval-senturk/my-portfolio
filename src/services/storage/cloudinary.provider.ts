import { v2 as cloudinary } from "cloudinary";

import type { MediaProvider } from "@prisma/client";

import { env } from "@/lib/env";
import type { ResponsiveImageOptions } from "@/lib/media/build-delivery-url";

import type { StorageProvider, StorageUploadInput, StorageUploadResult } from "./storage-provider.interface";

function ensureCloudinaryConfigured(): void {
  if (!env.cloudinary.configured) {
    throw new Error("Cloudinary is not configured.");
  }

  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

function buildTransformation(options: ResponsiveImageOptions = {}): string {
  const parts = [
    options.width ? `w_${options.width}` : undefined,
    options.height ? `h_${options.height}` : undefined,
    options.crop ? `c_${options.crop}` : options.width || options.height ? "c_limit" : undefined,
    options.quality ? `q_${options.quality}` : "q_auto",
    options.format ? `f_${options.format}` : "f_auto",
  ].filter(Boolean);

  return parts.join(",");
}

export class CloudinaryStorageProvider implements StorageProvider {
  readonly provider: MediaProvider = "CLOUDINARY";

  async upload(input: StorageUploadInput): Promise<StorageUploadResult> {
    ensureCloudinaryConfigured();

    const result = await new Promise<{
      public_id: string;
      secure_url: string;
      width?: number;
      height?: number;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: input.folder,
          public_id: input.filename.replace(/\.[^.]+$/, ""),
          resource_type: "auto",
          overwrite: false,
          unique_filename: true,
          use_filename: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed."));
            return;
          }

          resolve({
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            width: uploadResult.width,
            height: uploadResult.height,
            bytes: uploadResult.bytes,
          });
        },
      );

      uploadStream.end(input.buffer);
    });

    return {
      storageKey: result.public_id,
      publicUrl: result.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  }

  async delete(storageKey: string): Promise<void> {
    ensureCloudinaryConfigured();
    await cloudinary.uploader.destroy(storageKey, { resource_type: "auto" });
  }

  getDeliveryUrl(storageKey: string, publicUrl: string, options?: ResponsiveImageOptions): string {
    if (!env.cloudinary.configured || !env.cloudinary.cloudName) {
      return publicUrl;
    }

    const transformation = buildTransformation(options);

    if (!transformation) {
      return publicUrl;
    }

    return `https://res.cloudinary.com/${env.cloudinary.cloudName}/image/upload/${transformation}/${storageKey}`;
  }
}

export const cloudinaryStorageProvider = new CloudinaryStorageProvider();
