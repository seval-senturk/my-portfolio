"use client";

import { FolderOpen, Upload } from "lucide-react";
import { useState } from "react";

import { MediaPickerModal, type MediaSelection } from "@/features/admin/media/components/media-picker-modal";
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
  onChange?: (value: string) => void;
  onMediaSelect?: (selection: MediaSelection) => void;
  disabled?: boolean;
  enableLibrary?: boolean;
}

export function AdminUploadField({
  id,
  label,
  hint = "Enter a URL or pick from the Media Library.",
  error,
  name,
  accept = "image/*",
  value,
  defaultValue,
  mediaId,
  altText,
  category,
  onChange,
  onMediaSelect,
  disabled,
  enableLibrary = true,
}: AdminUploadFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value ?? defaultValue ?? "");

  const handleLibrarySelect = (asset: MediaAssetRecord) => {
    setPreviewUrl(asset.publicUrl);
    onChange?.(asset.publicUrl);
    onMediaSelect?.({
      id: asset.id,
      url: asset.publicUrl,
      altText: asset.altText ?? undefined,
    });
    setIsPickerOpen(false);
  };

  return (
    <>
      <AdminFormField id={id} label={label} hint={hint} error={error}>
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
                name={name}
                type="url"
                placeholder="https://..."
                value={value ?? previewUrl}
                defaultValue={value === undefined ? defaultValue : undefined}
                disabled={disabled}
                onChange={(event) => {
                  setPreviewUrl(event.target.value);
                  onChange?.(event.target.value);
                }}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
              />

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
                {enableLibrary ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled}
                    onClick={() => setIsPickerOpen(true)}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Browse library
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
          title={`Select ${label}`}
        />
      ) : null}
    </>
  );
}
