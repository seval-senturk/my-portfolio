import { blogJsonToHtml } from "@/lib/blog/tiptap/extensions";
import { hasBlogTextContent, sanitizeBlogHtml } from "@/lib/security/sanitize-html";

export interface BlogContentSource {
  contentHtml: string;
  contentJson?: Record<string, unknown>;
}

/**
 * Prefer TipTap JSON as source of truth, sanitize output, and reject empty content.
 */
export function resolveSanitizedBlogHtml(input: BlogContentSource): string {
  const rawHtml =
    input.contentJson && Object.keys(input.contentJson).length > 0
      ? blogJsonToHtml(input.contentJson)
      : input.contentHtml.trim();

  const sanitized = sanitizeBlogHtml(rawHtml);

  if (!hasBlogTextContent(sanitized)) {
    throw new Error("Blog content cannot be empty.");
  }

  return sanitized;
}
