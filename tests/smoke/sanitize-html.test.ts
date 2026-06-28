import { describe, expect, it } from "vitest";

import { hasBlogTextContent, sanitizeBlogHtml } from "@/lib/security/sanitize-html";

describe("sanitizeBlogHtml", () => {
  it("removes script tags and event handlers", () => {
    const dirty =
      '<p>Hello</p><script>alert("xss")</script><img src=x onerror="alert(1)">';

    const clean = sanitizeBlogHtml(dirty);

    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onerror");
    expect(clean).toContain("<p>Hello</p>");
  });

  it("preserves safe TipTap-like markup", () => {
    const html =
      '<h2>Title</h2><p>Paragraph with <strong>bold</strong> and <a href="https://example.com">link</a>.</p>';

    const clean = sanitizeBlogHtml(html);

    expect(clean).toContain("<h2>Title</h2>");
    expect(clean).toContain("<strong>bold</strong>");
    expect(clean).toContain('href="https://example.com"');
    expect(clean).toContain('rel="noopener noreferrer"');
  });

  it("detects empty content after sanitization", () => {
    expect(hasBlogTextContent("<p></p>")).toBe(false);
    expect(hasBlogTextContent("<p>Real content</p>")).toBe(true);
  });
});

describe("blog render safety", () => {
  it("blocks javascript: links", () => {
    const clean = sanitizeBlogHtml('<a href="javascript:alert(1)">click</a>');
    expect(clean).not.toContain("javascript:");
  });
});
