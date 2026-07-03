"use client";

import { FolderOpen, HardDriveUpload, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { MediaPickerModal, type MediaSelection } from "@/features/admin/media/components/media-picker-modal";
import { adminTr } from "@/features/admin/i18n/tr";
import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { cn } from "@/lib/cn";
import type { MediaAssetRecord } from "@/types/media-management";

import { Button } from "@/components/ui/button";

interface AdminUploadFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  name?: string;
  accept?: string;
  value?: string;
  defaultValue?: string;
  mediaId?: string;
  altText?: string;
  category?: string;
  folderSlug?: string;
  onChange?: (value: string) => void;
  onMediaSelect?: (selection: MediaSelection) => void;
  disabled?: boolean;
  enableLibrary?: boolean;
  enableLocalUpload?: boolean;
}

export function AdminUploadField({
  id,
  label,
  hint = adminTr.media.uploadField.hint,
  error,
  name,
  accept = "image/*",
  value,
  defaultValue,
  mediaId,
  altText,
  category,
  folderSlug,
  onChange,
  onMediaSelect,
  disabled,
  enableLibrary = true,
  enableLocalUpload = true,
}: AdminUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState(value ?? defaultValue ?? "");

  useEffect(() => {
    setPreviewUrl(value ?? defaultValue ?? "");
  }, [value, defaultValue]);

  const handleLibrarySelect = (asset: MediaAssetRecord) => {
    setPreviewUrl(asset.publicUrl);
    setUploadError(undefined);
    onChange?.(asset.publicUrl);
    onMediaSelect?.({
      id: asset.id,
      url: asset.publicUrl,
      altText: asset.altText ?? undefined,
    });
    setIsPickerOpen(false);
  };

  async function handleLocalFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(undefined);

    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    if (folderSlug) formData.append("folderSlug", folderSlug);
    if (altText) formData.append("altText", altText);

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? adminTr.media.upload.uploadFailed);
      }

      const payload = (await response.json()) as { asset: MediaAssetRecord };
      setPreviewUrl(payload.asset.publicUrl);
      onChange?.(payload.asset.publicUrl);
      onMediaSelect?.({
        id: payload.asset.id,
        url: payload.asset.publicUrl,
        altText: payload.asset.altText ?? undefined,
      });
    } catch (uploadErr) {
      setUploadError(
        uploadErr instanceof Error
          ? uploadErr.message
          : adminTr.media.upload.uploadFailed,
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <AdminFormField
        id={id}
        label={label}
        hint={hint}
        error={error ?? uploadError}
      >
        <div
          className={cn(
            "rounded-xl border border-dashed border-border bg-muted/40 p-4",
            disabled && "opacity-60",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-surface p-2 text-muted-foreground">
              <Upload className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex-1 space-y-3">
              <input
                id={id}
                type="text"
                inputMode="url"
                spellCheck={false}
                placeholder="https://... veya /uploads/..."
                value={previewUrl}
                disabled={disabled || isUploading}
                onChange={(event) => {
                  setPreviewUrl(event.target.value);
                  setUploadError(undefined);
                  onChange?.(event.target.value);
                }}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
              />

              {name ? (
                <input type="hidden" name={name} value={previewUrl} readOnly />
              ) : null}

              {mediaId ? (
                <input type="hidden" name={`${name ?? id}MediaId`} value={mediaId} />
              ) : null}

              {altText ? (
                <input type="hidden" name={`${name ?? id}AltText`} value={altText} />
              ) : null}

              {previewUrl && accept.includes("image") ? (
                <div className="overflow-hidden rounded-lg border border-border bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={altText ?? label}
                    className="max-h-40 w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {enableLocalUpload ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={accept}
                      className="sr-only"
                      disabled={disabled || isUploading}
                      onChange={handleLocalFileSelect}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={disabled || isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <HardDriveUpload className="h-4 w-4" aria-hidden />
                      )}
                      {isUploading
                        ? adminTr.media.uploadField.uploading
                        : adminTr.media.uploadField.browseComputer}
                    </Button>
                  </>
                ) : null}
                {enableLibrary ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled || isUploading}
                    onClick={() => setIsPickerOpen(true)}
                  >
                    <FolderOpen className="h-4 w-4" />
                    {adminTr.media.uploadField.browseLibrary}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </AdminFormField>

      {enableLibrary ? (
        <MediaPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleLibrarySelect}
          categoryFilter={category}
          title={`${adminTr.media.uploadField.select} ${label}`}
        />
      ) : null}
    </>
  );
}
