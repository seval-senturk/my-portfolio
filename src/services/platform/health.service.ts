import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { isCloudinaryConfigured } from "@/lib/media/build-delivery-url";
import type { HealthCheckResult } from "@/types/platform";

import { getPlatformEnvironmentInfo } from "./settings.service";

async function checkDatabase(): Promise<{ status: "pass" | "fail"; latencyMs: number; message?: string }> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "pass", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      status: "fail",
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : "Database unreachable",
    };
  }
}

export async function runHealthChecks(): Promise<HealthCheckResult> {
  const checks: HealthCheckResult["checks"] = [];
  const envInfo = getPlatformEnvironmentInfo();

  const db = await checkDatabase();
  checks.push({
    name: "database",
    status: db.status,
    latencyMs: db.latencyMs,
    message: db.message,
  });

  checks.push({
    name: "auth_secret",
    status: env.authSecret ? "pass" : "warn",
    message: env.authSecret ? undefined : "AUTH_SECRET is not configured",
  });

  checks.push({
    name: "site_url",
    status: env.siteUrl.startsWith("http") ? "pass" : "warn",
    message: `Site URL: ${env.siteUrl}`,
  });

  checks.push({
    name: "cloudinary",
    status: isCloudinaryConfigured() ? "pass" : "warn",
    message: isCloudinaryConfigured()
      ? "Cloudinary configured"
      : "Using local storage fallback",
  });

  checks.push({
    name: "email_provider",
    status: envInfo.emailProvider === "stub" && env.isProduction ? "warn" : "pass",
    message: `Provider: ${envInfo.emailProvider}`,
  });

  const hasFail = checks.some((check) => check.status === "fail");
  const hasWarn = checks.some((check) => check.status === "warn");

  return {
    status: hasFail ? "unhealthy" : hasWarn ? "degraded" : "healthy",
    timestamp: new Date().toISOString(),
    checks,
  };
}

export async function getMetricsSnapshot() {
  const [blogCount, projectCount, mediaCount, auditCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.project.count(),
    prisma.mediaAsset.count({ where: { isLatest: true } }),
    prisma.auditLog.count(),
  ]);

  return {
    timestamp: new Date().toISOString(),
    content: {
      blogPosts: blogCount,
      projects: projectCount,
      mediaAssets: mediaCount,
    },
    auditLogs: auditCount,
    environment: getPlatformEnvironmentInfo(),
  };
}
