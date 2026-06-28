import { describe, expect, it } from "vitest";

import { getMissingProductionEnvVars } from "@/lib/env.validation";

describe("production env validation", () => {
  it("returns empty list outside production", () => {
    expect(getMissingProductionEnvVars()).toEqual([]);
  });
});

describe("home page streaming", () => {
  it("includes below-fold Suspense module", async () => {
    const fs = await import("node:fs");
    expect(fs.existsSync("src/features/home/components/home-below-fold-sections.tsx")).toBe(true);
    expect(fs.existsSync("src/features/home/components/home-below-fold-skeleton.tsx")).toBe(true);
  });
});

describe("observability client", () => {
  it("exports reportClientError helper", async () => {
    const client = await import("@/lib/observability/client");
    expect(client.reportClientError).toBeTypeOf("function");
  });
});
