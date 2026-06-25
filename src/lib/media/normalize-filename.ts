const MAX_FILENAME_LENGTH = 120;

export function normalizeFilename(originalName: string): string {
  const dotIndex = originalName.lastIndexOf(".");
  const base = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
  const extension = dotIndex > 0 ? originalName.slice(dotIndex).toLowerCase() : "";

  const normalizedBase = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_FILENAME_LENGTH);

  const safeBase = normalizedBase || "asset";
  const timestamp = Date.now().toString(36);

  return `${safeBase}-${timestamp}${extension}`;
}
