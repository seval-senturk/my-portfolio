import { describe, expect, it } from "vitest";

import { CACHE_TAGS } from "@/lib/cache/server";

describe("seo resolver cache tags", () => {
  it("registers seo tag for resolver invalidation", () => {
    expect(CACHE_TAGS.seo).toBe("seo");
    expect(CACHE_TAGS.content).toBe("content");
  });
});
