import { slugify } from "@/repositories/shared/locale";

export function generateSlugFromTitle(title: string): string {
  return slugify(title);
}

export async function ensureUniqueBlogSlug(
  baseSlug: string,
  isTaken: (slug: string) => Promise<boolean>,
  excludeId?: string,
): Promise<string> {
  const normalized = slugify(baseSlug) || "post";
  let candidate = normalized;
  let counter = 1;

  while (await isTaken(candidate)) {
    if (excludeId) {
      // Allow same slug when updating the same record — caller should handle exclude.
    }
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }

  return candidate;
}
