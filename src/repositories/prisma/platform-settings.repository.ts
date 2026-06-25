import type { Prisma } from "@prisma/client";

import {
  DEFAULT_FEATURE_FLAGS,
  type FeatureFlagKey,
} from "@/constants/feature-flags";
import { prisma } from "@/lib/prisma";
import type { ApplicationSettingsRecord, PlatformBranding, ResolvedFeatureFlags } from "@/types/platform";

const DEFAULT_ID = "default";
const DEFAULT_LOCALE = "en";

function parseFeatureFlags(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_FEATURE_FLAGS };
  }

  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...(value as Record<string, boolean>),
  };
}

function parseBranding(value: unknown): PlatformBranding {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as PlatformBranding;
}

function mapSettings(record: {
  id: string;
  locale: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  featureFlags: unknown;
  branding: unknown;
  notificationPrefs: unknown;
  updatedAt: Date;
}): ApplicationSettingsRecord {
  return {
    id: record.id,
    locale: record.locale,
    maintenanceMode: record.maintenanceMode,
    maintenanceMessage: record.maintenanceMessage,
    featureFlags: parseFeatureFlags(record.featureFlags),
    branding: parseBranding(record.branding),
    notificationPrefs: (record.notificationPrefs as Record<string, unknown>) ?? {},
    updatedAt: record.updatedAt,
  };
}

export async function ensureApplicationSettings(): Promise<ApplicationSettingsRecord> {
  const record = await prisma.applicationSettings.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {},
    create: {
      id: DEFAULT_ID,
      locale: DEFAULT_LOCALE,
      featureFlags: DEFAULT_FEATURE_FLAGS as unknown as Prisma.InputJsonValue,
      branding: {},
      notificationPrefs: {},
    },
  });

  return mapSettings(record);
}

export async function getApplicationSettings(
  locale = DEFAULT_LOCALE,
): Promise<ApplicationSettingsRecord> {
  const record = await prisma.applicationSettings.findUnique({ where: { locale } });

  if (!record) {
    return ensureApplicationSettings();
  }

  return mapSettings(record);
}

export async function updateApplicationSettings(input: {
  maintenanceMode?: boolean;
  maintenanceMessage?: string | null;
  featureFlags?: Record<string, boolean>;
  branding?: PlatformBranding;
}): Promise<ApplicationSettingsRecord> {
  await ensureApplicationSettings();

  const record = await prisma.applicationSettings.update({
    where: { locale: DEFAULT_LOCALE },
    data: {
      maintenanceMode: input.maintenanceMode,
      maintenanceMessage: input.maintenanceMessage,
      featureFlags: input.featureFlags as Prisma.InputJsonValue | undefined,
      branding: input.branding as Prisma.InputJsonValue | undefined,
    },
  });

  return mapSettings(record);
}

export function resolveFeatureFlags(
  settings: ApplicationSettingsRecord,
): ResolvedFeatureFlags {
  const flags = { ...DEFAULT_FEATURE_FLAGS };

  for (const key of Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[]) {
    if (typeof settings.featureFlags[key] === "boolean") {
      flags[key] = settings.featureFlags[key] as boolean;
    }
  }

  return flags;
}
