"use client";

import { AlertTriangle, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { MEDIA_CATEGORIES } from "@/constants/media-categories";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error" | "cancelled";
  error?: string;
  abortController?: AbortController;
}

interface MediaUploadZoneProps {
  category?: string;
  folderSlug?: string;
  onUploaded?: () => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUploadZone({
  category,
  folderSlug,
  onUploaded,
  className,
}: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState(category ?? "");
  const [items, setItems] = useState<UploadItem[]>([]);

  const uploadFile = useCallback(
    async (item: UploadItem) => {
      const controller = new AbortController();

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, status: "uploading", progress: 10, abortController: controller }
            : entry,
        ),
      );

      const formData = new FormData();
      formData.append("file", item.file);
      if (uploadCategory) formData.append("category", uploadCategory);
      if (folderSlug) formData.append("folderSlug", folderSlug);

      try {
        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? adminTr.media.upload.uploadFailed);
        }

        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id ? { ...entry, status: "success", progress: 100 } : entry,
          ),
        );
        onUploaded?.();
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setItems((current) =>
            current.map((entry) =>
              entry.id === item.id ? { ...entry, status: "cancelled", progress: 0 } : entry,
            ),
          );
          return;
        }

        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  status: "error",
                  progress: 0,
                  error: error instanceof Error ? error.message : adminTr.media.upload.uploadFailed,
                }
              : entry,
          ),
        );
      }
    },
    [folderSlug, onUploaded, uploadCategory],
  );

  const queueFiles = useCallback(
    (files: FileList | File[]) => {
      const nextItems: UploadItem[] = Array.from(files).map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        progress: 0,
        status: "pending" as const,
      }));

      setItems((current) => [...nextItems, ...current]);
      nextItems.forEach((item) => {
        void uploadFile(item);
      });
    },
    [uploadFile],
  );

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      queueFiles(event.dataTransfer.files);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border border-dashed p-6 transition-base",
          isDragging
            ? "border-[var(--admin-brand,#7c3aed)] bg-[var(--admin-brand-muted,rgb(124_58_237_/_0.12))]"
            : "border-border bg-muted/30",
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-surface p-3 text-muted-foreground">
            <Upload className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <Text className="font-medium">{adminTr.media.upload.dragDrop}</Text>
            <Text tone="muted" className="text-caption">
              {adminTr.media.upload.types}
            </Text>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <select
              value={uploadCategory}
              onChange={(event) => setUploadCategory(event.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-small"
              aria-label={adminTr.media.upload.uploadCategory}
            >
              <option value="">{adminTr.media.upload.noCategory}</option>
              {MEDIA_CATEGORIES.map((entry) => (
                <option key={entry} value={entry}>
                  {adminTr.media.categoryNames[entry]}
                </option>
              ))}
            </select>
            <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
              {adminTr.media.upload.browseFiles}
            </Button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,image/svg+xml"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  queueFiles(event.target.files);
                  event.target.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2" aria-label={adminTr.media.upload.uploadQueue}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-medium">{item.file.name}</p>
                <p className="text-caption text-muted-foreground">{formatBytes(item.file.size)}</p>
                {item.status === "uploading" || item.status === "success" ? (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all",
                        item.status === "success" ? "bg-green-500" : "bg-[var(--admin-brand,#7c3aed)]",
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}
                {item.error ? (
                  <p className="mt-1 flex items-center gap-1 text-caption text-red-600">
                    <AlertTriangle className="h-3 w-3" aria-hidden />
                    {item.error}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1">
                {item.status === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={adminTr.media.uploadCancel}
                      onClick={() => item.abortController?.abort()}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : null}
                {item.status === "error" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => void uploadFile(item)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
