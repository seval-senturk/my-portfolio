"use client";

import { useState, useTransition } from "react";

import {
  FEATURE_FLAG_LABELS,
  saveBrandingSettingsAction,
  saveFeatureFlagsAction,
  saveMaintenanceSettingsAction,
} from "@/features/admin/actions/settings.actions";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import {
  DEFAULT_FEATURE_FLAGS,
  type FeatureFlagKey,
} from "@/constants/feature-flags";
import type { ApplicationSettingsRecord, PlatformEnvironmentInfo } from "@/types/platform";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "@/components/ui/link";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

interface SettingsAdminViewProps {
  settings: ApplicationSettingsRecord;
  environment: PlatformEnvironmentInfo;
}

export function SettingsAdminView({ settings, environment }: SettingsAdminViewProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});

  const handleResult = (result: { success: boolean; data?: unknown; error?: string }) => {
    setStatus(
      result.success
        ? { success: String(result.data ?? "Saved.") }
        : { error: result.error ?? "Save failed." },
    );
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Platform Settings"
        description="Central application settings, feature flags, maintenance mode, and environment overview."
      />

      <AdminFormStatus error={status.error} success={status.success} />

      <div className="flex flex-wrap gap-3">
        <Link href={`${ADMIN_ROUTES.settings}/audit`} className="text-small">
          View audit log →
        </Link>
        <Link href="/api/health" className="text-small" target="_blank" rel="noopener noreferrer">
          Platform health check →
        </Link>
      </div>

      <section className="admin-surface space-y-4 p-6">
        <div>
          <Text className="font-semibold">Environment</Text>
          <Text tone="muted" className="text-caption">
            Read-only runtime configuration (not stored in database).
          </Text>
        </div>
        <dl className="grid gap-3 text-small md:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Node environment</dt>
            <dd className="font-medium">{environment.nodeEnv}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Site URL</dt>
            <dd className="font-medium">{environment.siteUrl}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email provider</dt>
            <dd className="font-medium">{environment.emailProvider}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Cache provider</dt>
            <dd className="font-medium">{environment.cacheProvider}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Cloudinary</dt>
            <dd className="font-medium">
              {environment.cloudinaryConfigured ? "Configured" : "Local fallback"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="admin-surface space-y-4 p-6">
        <Text className="font-semibold">Maintenance Mode</Text>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              handleResult(await saveMaintenanceSettingsAction(formData));
            });
          }}
          className="space-y-4"
        >
          <label className="flex items-center gap-2 text-small">
            <input
              type="checkbox"
              name="maintenanceMode"
              defaultChecked={settings.maintenanceMode}
              className="rounded border-border"
            />
            Enable maintenance mode (public site)
          </label>
          <label className="block space-y-1 text-small">
            <span>Maintenance message</span>
            <textarea
              name="maintenanceMessage"
              rows={3}
              defaultValue={settings.maintenanceMessage ?? ""}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2"
              placeholder="We are performing scheduled maintenance..."
            />
          </label>
          <Button type="submit" disabled={isPending}>
            Save maintenance settings
          </Button>
        </form>
      </section>

      <section className="admin-surface space-y-4 p-6">
        <Text className="font-semibold">Feature Flags</Text>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              handleResult(await saveFeatureFlagsAction(formData));
            });
          }}
          className="space-y-3"
        >
          {(Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[]).map((flag) => (
            <label key={flag} className="flex items-center justify-between gap-4 text-small">
              <span>{FEATURE_FLAG_LABELS[flag]}</span>
              <input
                type="checkbox"
                name={`flag_${flag}`}
                defaultChecked={settings.featureFlags[flag] ?? DEFAULT_FEATURE_FLAGS[flag]}
                className="rounded border-border"
              />
            </label>
          ))}
          <Button type="submit" disabled={isPending}>
            Save feature flags
          </Button>
        </form>
      </section>

      <section className="admin-surface space-y-4 p-6">
        <Text className="font-semibold">Branding</Text>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              handleResult(await saveBrandingSettingsAction(formData));
            });
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <label className="space-y-1 text-small">
            <span>Primary color (CSS)</span>
            <input
              name="primaryColor"
              defaultValue={settings.branding.primaryColor ?? ""}
              placeholder="#7c3aed"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-small">
            <span>Admin brand color (CSS)</span>
            <input
              name="adminBrandColor"
              defaultValue={settings.branding.adminBrandColor ?? ""}
              placeholder="#7c3aed"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2"
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              Save branding
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
