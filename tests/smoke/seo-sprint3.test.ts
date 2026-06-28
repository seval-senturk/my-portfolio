import { describe, expect, it } from "vitest";

import { INDEXABLE_STATIC_SEO_PAGES } from "@/lib/seo/public-routes";
import { buildDynamicRobots } from "@/services/seo/seo-sitemap.service";

describe("sitemap indexing strategy", () => {
  it("indexes only public static portfolio routes", () => {
    const paths = INDEXABLE_STATIC_SEO_PAGES.map((page) => page.routePath);

    expect(paths).toEqual(
      expect.arrayContaining(["/", "/about", "/experience", "/projects", "/resume", "/blog"]),
    );
    expect(paths).not.toContain("/career");
    expect(paths).not.toContain("/admin");
  });
});

describe("robots.txt indexing strategy", () => {
  it("blocks admin routes in production when indexing is allowed", async () => {
    const robots = await buildDynamicRobots();
    const rules = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;

    if (rules?.allow === "/") {
      expect(rules.disallow).toEqual(expect.arrayContaining(["/admin"]));
    }
  });
});

describe("project anchor paths", () => {
  it("uses in-page anchors instead of phantom detail routes", async () => {
    const { getProjectAnchorPath } = await import("@/lib/projects");

    expect(getProjectAnchorPath("my-project")).toBe("/projects#my-project");
    expect(getProjectAnchorPath("my-project")).not.toContain("/projects/my-project");
  });
});

describe("resume structured data input", () => {
  it("maps resume content into ATS-friendly structured fields", async () => {
    const { resumeContent } = await import("@/data/resume.data");
    const { experienceContent } = await import("@/data/experience.data");
    const { skillsContent } = await import("@/data/skills.data");
    const { toResumeStructuredDataInput } = await import("@/lib/resume");

    const input = toResumeStructuredDataInput(
      resumeContent,
      experienceContent,
      skillsContent,
    );

    expect(input.fullName).toBeTruthy();
    expect(input.skills.length).toBeGreaterThan(0);
    expect(input.workHistory.length).toBeGreaterThan(0);
    expect(input.summary.length).toBeGreaterThan(0);
  });
});
