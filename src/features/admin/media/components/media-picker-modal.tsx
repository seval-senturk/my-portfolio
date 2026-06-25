"use client";

import { Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AdminModal } from "@/features/admin/ui/modal/admin-modal";
import type { MediaAssetRecord, MediaListResult } from "@/types/media-management";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAssetRecord) => void;
  title?: string;
  categoryFilter?: string;
  acceptTypes?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select from Media Library",
  categoryFilter,
}: MediaPickerModalProps) {
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter) params.set("category", categoryFilter);
      params.set("pageSize", "24");

      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const payload = (await response.json()) as MediaListResult;
      setAssets(payload.items);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    if (isOpen) {
      void loadAssets();
    }
  }, [isOpen, loadAssets]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Choose an existing asset from the central media library."
      size="xl"
      footer={
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void loadAssets();
              }
            }}
            placeholder="Search media…"
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : assets.length === 0 ? (
          <Text tone="muted">No matching assets found.</Text>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelect(asset)}
                className="overflow-hidden rounded-lg border border-border text-left transition-base hover:border-[var(--admin-brand,#7c3aed)]"
              >
                <div className="flex aspect-video items-center justify-center bg-muted/40">
                  {["IMAGE", "SVG", "ICON", "LOGO"].includes(asset.assetType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.publicUrl}
                      alt={asset.altText ?? asset.title ?? asset.filename}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Text tone="muted" className="text-caption">
                      {asset.assetType}
                    </Text>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-caption font-medium">{asset.title ?? asset.filename}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminModal>
  );
}

export interface MediaSelection {
  id?: string;
  url: string;
  altText?: string;
}
