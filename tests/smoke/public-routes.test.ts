import { describe, expect, it } from "vitest";

import { INDEXABLE_STATIC_SEO_PAGES, isPublicSiteRoute } from "@/lib/seo/public-routes";

describe("sitemap public routes", () => {
  it("excludes /career from indexable static pages", () => {
    const paths = INDEXABLE_STATIC_SEO_PAGES.map((page) => page.routePath);
    expect(paths).not.toContain("/career");
  });

  it("includes core portfolio routes", () => {
    expect(isPublicSiteRoute("/")).toBe(true);
    expect(isPublicSiteRoute("/resume")).toBe(true);
    expect(isPublicSiteRoute("/blog")).toBe(true);
    expect(isPublicSiteRoute("/career")).toBe(false);
  });
});
