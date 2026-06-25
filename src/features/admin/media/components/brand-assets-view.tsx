"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { BRAND_ASSET_FIELDS } from "@/constants/media-categories";
import { assignBrandAssetAction } from "@/features/admin/actions/media.actions";
import { MediaAdminShell } from "@/features/admin/media/components/media-admin-shell";
import { MediaPickerModal } from "@/features/admin/media/components/media-picker-modal";
import type { MediaAssetRecord, MediaUsageRecord } from "@/types/media-management";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface BrandAssetsViewProps {
  assignments: MediaUsageRecord[];
  assets: MediaAssetRecord[];
}

export function BrandAssetsView({ assignments, assets }: BrandAssetsViewProps) {
  const [assetMap, setAssetMap] = useState<Record<string, MediaAssetRecord>>({});
  const [pickerField, setPickerField] = useState<(typeof BRAND_ASSET_FIELDS)[number] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const map: Record<string, MediaAssetRecord> = {};

    for (const asset of assets) {
      map[asset.id] = asset;
    }

    setAssetMap(map);
  }, [assets]);

  const assignmentByField = useCallback(
    (fieldName: string) => assignments.find((entry) => entry.fieldName === fieldName),
    [assignments],
  );

  const handleAssign = (asset: MediaAssetRecord) => {
    if (!pickerField) {
      return;
    }

    const formData = new FormData();
    formData.set("mediaId", asset.id);
    formData.set("fieldName", pickerField.fieldName);
    formData.set("label", pickerField.label);

    startTransition(async () => {
      const result = await assignBrandAssetAction(formData);
      setStatusMessage(result.success ? String(result.data ?? "Assigned.") : result.error ?? null);
      setPickerField(null);
      window.location.reload();
    });
  };

  return (
    <MediaAdminShell
      title="Brand Assets"
      description="Manage logos, favicons, PWA icons, and default Open Graph images from one place."
    >
      {statusMessage ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-small" role="status">
          {statusMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {BRAND_ASSET_FIELDS.map((field) => {
          const assignment = assignmentByField(field.fieldName);
          const asset = assignment ? assetMap[assignment.mediaId] : undefined;

          return (
            <article key={field.fieldName} className="admin-surface space-y-3 p-4">
              <div>
                <Text className="font-medium">{field.label}</Text>
                <Text tone="muted" className="text-caption">
                  Category: {field.category}
                </Text>
              </div>

              {asset && ["IMAGE", "SVG", "ICON", "LOGO"].includes(asset.assetType) ? (
                <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.publicUrl}
                    alt={asset.altText ?? field.label}
                    className="max-h-32 w-full object-contain p-2"
                  />
                </div>
              ) : asset ? (
                <Text tone="muted" className="text-caption">
                  {asset.filename}
                </Text>
              ) : (
                <Text tone="muted" className="text-caption">
                  Not assigned
                </Text>
              )}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isPending}
                onClick={() => setPickerField(field)}
              >
                {asset ? "Change asset" : "Select asset"}
              </Button>
            </article>
          );
        })}
      </div>

      <MediaPickerModal
        isOpen={Boolean(pickerField)}
        onClose={() => setPickerField(null)}
        onSelect={handleAssign}
        categoryFilter={pickerField?.category}
        title={pickerField ? `Select ${pickerField.label}` : "Select asset"}
      />
    </MediaAdminShell>
  );
}
