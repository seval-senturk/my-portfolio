"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import {
  DEFAULT_FEATURE_FLAGS,
  FEATURE_FLAG_LABELS,
  type FeatureFlagKey,
} from "@/constants/feature-flags";
import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { CACHE_TAGS } from "@/lib/cache/server";
import { AuditActions, recordAudit } from "@/lib/platform/audit";
import { requireAdminUser } from "@/lib/auth/session";
import { cacheDelete } from "@/services/platform/cache.service";
import { savePlatformSettings } from "@/services/platform/settings.service";

function revalidateSettingsPaths() {
  revalidateTag(CACHE_TAGS.settings);
  revalidateTag(CACHE_TAGS.content);
  revalidatePath(ADMIN_ROUTES.settings);
  revalidatePath("/");
}

export async function saveMaintenanceSettingsAction(formData: FormData) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const maintenanceMode = formData.get("maintenanceMode") === "on";
  const maintenanceMessage = String(formData.get("maintenanceMessage") ?? "") || null;

  try {
    await savePlatformSettings({ maintenanceMode, maintenanceMessage });
    await cacheDelete("platform:application-settings");

    await recordAudit({
      user,
      action: AuditActions.SETTINGS_UPDATED,
      category: "SETTINGS",
      summary: maintenanceMode ? "Maintenance mode enabled" : "Maintenance mode disabled",
    });

    revalidateSettingsPaths();
    return adminSuccess("Maintenance settings saved.");
  } catch {
    return adminError("Failed to save maintenance settings.");
  }
}

export async function saveFeatureFlagsAction(formData: FormData) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const featureFlags: Record<string, boolean> = {};

  for (const key of Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[]) {
    featureFlags[key] = formData.get(`flag_${key}`) === "on";
  }

  try {
    await savePlatformSettings({ featureFlags });
    await cacheDelete("platform:application-settings");

    await recordAudit({
      user,
      action: AuditActions.FEATURE_FLAGS_UPDATED,
      category: "SETTINGS",
      summary: "Feature flags updated",
      metadata: featureFlags,
    });

    revalidateSettingsPaths();
    return adminSuccess("Feature flags saved.");
  } catch {
    return adminError("Failed to save feature flags.");
  }
}

export async function saveBrandingSettingsAction(formData: FormData) {
  let user;

  try {
    user = await requireAdminUser();
  } catch {
    return adminError("Unauthorized.");
  }

  const primaryColor = String(formData.get("primaryColor") ?? "") || undefined;
  const adminBrandColor = String(formData.get("adminBrandColor") ?? "") || undefined;

  try {
    await savePlatformSettings({
      branding: {
        primaryColor,
        adminBrandColor,
      },
    });
    await cacheDelete("platform:application-settings");

    await recordAudit({
      user,
      action: AuditActions.SETTINGS_UPDATED,
      category: "SETTINGS",
      summary: "Branding settings updated",
    });

    revalidateSettingsPaths();
    return adminSuccess("Branding settings saved.");
  } catch {
    return adminError("Failed to save branding settings.");
  }
}

export { FEATURE_FLAG_LABELS };
