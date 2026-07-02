import { describe, expect, it } from "vitest";

import { getMissingProductionEnvVars } from "@/lib/env.validation";

describe("production env validation", () => {
  it("returns empty list outside production", () => {
    expect(getMissingProductionEnvVars()).toEqual([]);
  });
});

describe("home page layout", () => {
  it("renders core sections without below-fold projects block", async () => {
    const fs = await import("node:fs");
    const pageSource = fs.readFileSync("src/app/(site)/page.tsx", "utf8");

    expect(pageSource).toContain("ExpertiseCarouselSection");
    expect(pageSource).not.toContain("HomeBelowFoldSections");
    expect(pageSource).not.toContain("ProjectsSection");
  });
});

describe("observability client", () => {
  it("exports reportClientError helper", async () => {
    const client = await import("@/lib/observability/client");
    expect(client.reportClientError).toBeTypeOf("function");
  });
});
