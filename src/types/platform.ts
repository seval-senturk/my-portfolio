import type { FeatureFlagKey } from "@/constants/feature-flags";

export type AuditActionCategory =
  | "CONTENT"
  | "SEO"
  | "MEDIA"
  | "AUTH"
  | "SETTINGS"
  | "SYSTEM";

export type LogLevel = "info" | "warn" | "error" | "critical";

export interface PlatformLogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

export type NotificationLevel = "success" | "warning" | "error" | "info";

export interface PlatformNotification {
  level: NotificationLevel;
  title: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface PlatformBranding {
  primaryColor?: string;
  adminBrandColor?: string;
  logoMediaId?: string;
}

export interface ApplicationSettingsRecord {
  id: string;
  locale: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  featureFlags: Record<string, boolean>;
  branding: PlatformBranding;
  notificationPrefs: Record<string, unknown>;
  updatedAt: Date;
}

export interface AuditLogRecord {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  category: AuditActionCategory;
  entityType: string | null;
  entityId: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface AuditLogInput {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  category?: AuditActionCategory;
  entityType?: string;
  entityId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface SearchResultItem {
  id: string;
  type: "blog" | "project" | "experience";
  title: string;
  excerpt?: string;
  href: string;
  score?: number;
}

export interface SearchQuery {
  q: string;
  types?: Array<"blog" | "project" | "experience">;
  limit?: number;
}

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: HealthCheckItem[];
}

export interface HealthCheckItem {
  name: string;
  status: "pass" | "warn" | "fail";
  message?: string;
  latencyMs?: number;
}

/** Reserved for future AI semantic search */
export interface SearchProviderHooks {
  semanticSearch?: (query: SearchQuery) => Promise<SearchResultItem[]>;
}

/** Reserved for future background job runners (Inngest, BullMQ, etc.) */
export interface JobQueueHooks {
  enqueue?: <T>(jobName: string, payload: T) => Promise<string>;
}

export interface PlatformEnvironmentInfo {
  nodeEnv: string;
  siteUrl: string;
  cloudinaryConfigured: boolean;
  emailProvider: string;
  cacheProvider: string;
}

export type ResolvedFeatureFlags = Record<FeatureFlagKey, boolean>;
