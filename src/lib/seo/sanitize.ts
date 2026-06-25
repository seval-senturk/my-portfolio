const HTML_TAG_PATTERN = /<[^>]*>/g;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeSeoText(value: string | undefined | null, maxLength?: number): string | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned = value
    .replace(HTML_TAG_PATTERN, "")
    .replace(CONTROL_CHARS_PATTERN, "")
    .trim();

  if (!cleaned) {
    return undefined;
  }

  if (maxLength && cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength);
  }

  return cleaned;
}

export function sanitizeSeoUrl(value: string | undefined | null): string | undefined {
  const cleaned = sanitizeSeoText(value, 2048);
  if (!cleaned) {
    return undefined;
  }

  try {
    const url = new URL(cleaned);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function sanitizeKeywords(values: string[] | undefined): string[] {
  if (!values?.length) {
    return [];
  }

  const unique = new Set<string>();

  for (const value of values) {
    const cleaned = sanitizeSeoText(value, 80);
    if (cleaned) {
      unique.add(cleaned.toLowerCase());
    }
  }

  return [...unique];
}

export function parseKeywordsInput(input: string | undefined): string[] {
  if (!input?.trim()) {
    return [];
  }

  return sanitizeKeywords(
    input
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  );
}

export function sanitizeRedirectPath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) {
    return `/${trimmed.replace(/^\/+/, "")}`;
  }
  return trimmed.replace(/\/+$/, "") || "/";
}
