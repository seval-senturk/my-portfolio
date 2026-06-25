import {
  getApplicationSettings,
  ensureApplicationSettings,
  resolveFeatureFlags,
  updateApplicationSettings,
} from "@/repositories/prisma/platform-settings.repository";
import { cacheDelete, cacheGetOrSet } from "@/services/platform/cache.service";
import type { FeatureFlagKey } from "@/constants/feature-flags";
import type { ApplicationSettingsRecord, PlatformBranding, PlatformEnvironmentInfo, ResolvedFeatureFlags } from "@/types/platform";
import { env } from "@/lib/env";
import { getCacheProvider } from "@/services/platform/cache.service";

const SETTINGS_CACHE_KEY = "platform:application-settings";

export async function getPlatformSettings(): Promise<ApplicationSettingsRecord> {
  return cacheGetOrSet(SETTINGS_CACHE_KEY, () => getApplicationSettings(), 60_000);
}

export async function getFeatureFlags(): Promise<ResolvedFeatureFlags> {
  const settings = await getPlatformSettings();
  return resolveFeatureFlags(settings);
}

export async function isFeatureEnabled(flag: FeatureFlagKey): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[flag];
}

export async function isMaintenanceModeActive(): Promise<boolean> {
  if (process.env.MAINTENANCE_MODE === "true") {
    return true;
  }

  const settings = await getPlatformSettings();
  return settings.maintenanceMode;
}

export async function savePlatformSettings(input: {
  maintenanceMode?: boolean;
  maintenanceMessage?: string | null;
  featureFlags?: Record<string, boolean>;
  branding?: PlatformBranding;
}): Promise<ApplicationSettingsRecord> {
  await ensureApplicationSettings();
  const updated = await updateApplicationSettings(input);
  await cacheDelete(SETTINGS_CACHE_KEY);
  return updated;
}

export function getPlatformEnvironmentInfo(): PlatformEnvironmentInfo {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    siteUrl: env.siteUrl,
    cloudinaryConfigured: env.cloudinary.configured,
    emailProvider: process.env.EMAIL_PROVIDER ?? "stub",
    cacheProvider: getCacheProvider().name,
  };
}

export {
  ensureApplicationSettings,
  getApplicationSettings,
  resolveFeatureFlags,
};
