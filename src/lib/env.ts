const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawValue: string | undefined): string {
  const trimmed = rawValue?.trim().replace(/^["']|["']$/g, "") ?? "";

  if (!trimmed) {
    return resolveFallbackSiteUrl();
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return resolveFallbackSiteUrl();
  }
}

function resolveFallbackSiteUrl(): string {
  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//i, "")}`;
  }

  return DEFAULT_SITE_URL;
}

function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET;
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return {
    cloudName,
    apiKey,
    apiSecret,
    configured: Boolean(cloudName && apiKey && apiSecret),
  };
}

function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.EMAIL_FROM?.trim() ?? "Portfolio <onboarding@resend.dev>";
  const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase() ?? "stub";

  return {
    provider,
    resendApiKey,
    fromAddress,
    configured:
      provider === "stub" ||
      (provider === "resend" && Boolean(resendApiKey)) ||
      provider === "smtp" ||
      provider === "sendgrid",
  };
}

export const env = {
  siteUrl: getSiteUrl(),
  authSecret: getAuthSecret(),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  cloudinary: getCloudinaryConfig(),
  email: getEmailConfig(),
} as const;
