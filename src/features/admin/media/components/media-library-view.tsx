"use client";

import {
  FileText,
  Grid3X3,
  Image as ImageIcon,
  LayoutList,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";

import { MEDIA_CATEGORIES } from "@/constants/media-categories";
import { deleteMediaAction, updateMediaMetadataAction } from "@/features/admin/actions/media.actions";
import { MediaAdminShell } from "@/features/admin/media/components/media-admin-shell";
import { MediaUploadZone } from "@/features/admin/media/components/media-upload-zone";
import { AdminConfirmDialog } from "@/features/admin/ui/modal/admin-confirm-dialog";
import { cn } from "@/lib/cn";
import { describeUsageLocation } from "@/lib/media/describe-usage";
import type { MediaAssetRecord, MediaFolderRecord, MediaListResult } from "@/types/media-management";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface MediaLibraryOverview {
  folders: MediaFolderRecord[];
  assets: MediaListResult;
}

interface MediaLibraryViewProps {
  initialData: MediaLibraryOverview;
}

type ViewMode = "grid" | "list";

function isVisualAsset(asset: MediaAssetRecord): boolean {
  return ["IMAGE", "SVG", "ICON", "LOGO"].includes(asset.assetType);
}

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MediaLibraryView({ initialData }: MediaLibraryViewProps) {
  const [folders] = useState(initialData.folders);
  const [assets, setAssets] = useState(initialData.assets.items);
  const [total, setTotal] = useState(initialData.assets.total);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [folderSlug, setFolderSlug] = useState("");
  const [sortBy, setSortBy] = useState<"uploadedAt" | "filename" | "size">("uploadedAt");
  const [selected, setSelected] = useState<MediaAssetRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAssetRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshAssets = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (folderSlug) params.set("folder", folderSlug);
    params.set("sortBy", sortBy);
    params.set("sortOrder", "desc");
    params.set("pageSize", "48");

    const response = await fetch(`/api/admin/media?${params.toString()}`);
    const payload = (await response.json()) as MediaListResult;
    setAssets(payload.items);
    setTotal(payload.total);
  }, [category, folderSlug, search, sortBy]);

  const seoWarnings = useMemo(() => {
    if (!selected) {
      return [];
    }

    const warnings: string[] = [];

    if (isVisualAsset(selected) && !selected.altText?.trim()) {
      warnings.push("Alt text is empty — required for accessibility and SEO.");
    }

    if (!selected.title?.trim()) {
      warnings.push("Title is empty — recommended for library search and SEO.");
    }

    return warnings;
  }, [selected]);

  const handleSaveMetadata = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selected) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("id", selected.id);

    startTransition(async () => {
      const result = await updateMediaMetadataAction(formData);
      setStatusMessage(result.success ? String(result.data ?? "Saved.") : result.error ?? null);
      await refreshAssets();
      const response = await fetch(`/api/admin/media/${selected.id}`);
      const payload = (await response.json()) as { asset: MediaAssetRecord };
      setSelected(payload.asset);
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const formData = new FormData();
    formData.set("id", deleteTarget.id);

    startTransition(async () => {
      const result = await deleteMediaAction(formData);
      setStatusMessage(result.success ? String(result.data ?? "Deleted.") : result.error ?? null);

      if (result.success) {
        setDeleteTarget(null);
        if (selected?.id === deleteTarget.id) {
          setSelected(null);
        }
        await refreshAssets();
      }
    });
  };

  return (
    <MediaAdminShell
      title="Media Library"
      description="Central digital asset management for portfolio, blog, resume, SEO, and brand assets."
    >
      <MediaUploadZone category={category} folderSlug={folderSlug || undefined} onUploaded={() => void refreshAssets()} />

      <div className="admin-surface space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void refreshAssets();
                }
              }}
              placeholder="Search by name, tag, category…"
              className="pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-small"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {MEDIA_CATEGORIES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={folderSlug}
            onChange={(event) => setFolderSlug(event.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-small"
            aria-label="Filter by folder"
          >
            <option value="">All folders</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.slug}>
                {folder.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-small"
            aria-label="Sort by"
          >
            <option value="uploadedAt">Upload date</option>
            <option value="filename">File name</option>
            <option value="size">File size</option>
          </select>
          <Button type="button" variant="secondary" onClick={() => void refreshAssets()}>
            Apply
          </Button>
          <div className="flex rounded-lg border border-border p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-md p-2",
                viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-md p-2",
                viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Text tone="muted" className="text-caption">
          {total} asset{total === 1 ? "" : "s"}
        </Text>

        {statusMessage ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-small" role="status">
            {statusMessage}
          </p>
        ) : null}

        {assets.length === 0 ? (
          <div className="py-12 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <Text className="mt-3 font-medium">No media assets yet</Text>
            <Text tone="muted" className="text-caption">
              Upload files using the drop zone above.
            </Text>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelected(asset)}
                className={cn(
                  "overflow-hidden rounded-xl border text-left transition-base hover:border-[var(--admin-brand,#7c3aed)]",
                  selected?.id === asset.id && "border-[var(--admin-brand,#7c3aed)] ring-2 ring-[var(--admin-brand,#7c3aed)]/20",
                )}
              >
                <div className="flex aspect-video items-center justify-center bg-muted/50">
                  {isVisualAsset(asset) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.publicUrl}
                      alt={asset.altText ?? asset.title ?? asset.filename}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FileText className="h-10 w-10 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-small font-medium">{asset.title ?? asset.filename}</p>
                  <p className="text-caption text-muted-foreground">{asset.category ?? asset.folder?.name ?? "Uncategorized"}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-small">
              <thead>
                <tr className="border-b border-border text-caption text-muted-foreground">
                  <th className="px-3 py-2">Preview</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={cn(
                      "cursor-pointer border-b border-border/60 hover:bg-muted/40",
                      selected?.id === asset.id && "bg-muted/60",
                    )}
                    onClick={() => setSelected(asset)}
                  >
                    <td className="px-3 py-2">
                      {isVisualAsset(asset) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.publicUrl}
                          alt=""
                          className="h-10 w-14 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-3 py-2">{asset.title ?? asset.filename}</td>
                    <td className="px-3 py-2">{asset.category ?? "—"}</td>
                    <td className="px-3 py-2">{asset.assetType}</td>
                    <td className="px-3 py-2">{formatDate(asset.uploadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected ? (
        <aside className="admin-surface space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Text className="font-semibold">Asset details</Text>
              <Text tone="muted" className="text-caption">
                {selected.filename} · v{selected.version}
              </Text>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>

          {isVisualAsset(selected) ? (
            <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.publicUrl}
                alt={selected.altText ?? selected.title ?? selected.filename}
                className="max-h-80 w-full object-contain"
              />
            </div>
          ) : (
            <a
              href={selected.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-small text-[var(--admin-brand,#7c3aed)]"
            >
              <FileText className="h-4 w-4" />
              Open file preview
            </a>
          )}

          {seoWarnings.length > 0 ? (
            <ul className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-caption text-amber-900">
              {seoWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}

          <form onSubmit={handleSaveMetadata} className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-small">
              <span>Title</span>
              <input
                name="title"
                defaultValue={selected.title ?? ""}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-small">
              <span>Category</span>
              <select
                name="category"
                defaultValue={selected.category ?? ""}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              >
                <option value="">None</option>
                {MEDIA_CATEGORIES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-small md:col-span-2">
              <span>Alt text</span>
              <input
                name="altText"
                defaultValue={selected.altText ?? ""}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-small md:col-span-2">
              <span>Caption</span>
              <input
                name="caption"
                defaultValue={selected.caption ?? ""}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-small md:col-span-2">
              <span>Description</span>
              <textarea
                name="description"
                defaultValue={selected.description ?? ""}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-small md:col-span-2">
              <span>Tags (comma-separated)</span>
              <input
                name="tags"
                defaultValue={selected.tags.join(", ")}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <Button type="submit" disabled={isPending}>
                Save metadata
              </Button>
              <Button
                type="button"
                variant="primary"
                className="bg-error hover:bg-error/90"
                onClick={() => setDeleteTarget(selected)}
                disabled={(selected.usages?.length ?? 0) > 0}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </form>

          {(selected.usages?.length ?? 0) > 0 ? (
            <div>
              <Text className="mb-2 font-medium">Used in</Text>
              <ul className="space-y-1 text-small text-muted-foreground">
                {selected.usages?.map((usage) => (
                  <li key={usage.id}>{describeUsageLocation(usage)}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <Text tone="muted" className="text-caption">
              Public URL
            </Text>
            <code className="mt-1 block overflow-x-auto rounded bg-muted px-2 py-1 text-caption">
              {selected.publicUrl}
            </code>
          </div>
        </aside>
      ) : null}

      <AdminConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete media asset?"
        description="This action cannot be undone. The file will be removed from storage."
        confirmLabel="Delete"
        variant="danger"
      />
    </MediaAdminShell>
  );
}
