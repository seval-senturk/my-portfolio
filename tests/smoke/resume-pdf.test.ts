import { describe, expect, it } from "vitest";

import {
  getResumePdfPublicPath,
  sanitizeResumePdfFilename,
} from "@/lib/resume/pdf-storage";

describe("resume PDF storage", () => {
  it("sanitizes unsafe filenames", () => {
    expect(sanitizeResumePdfFilename("../../evil.pdf")).toBe("evil.pdf");
    expect(sanitizeResumePdfFilename("My Resume.PDF")).toBe("my-resume.pdf");
  });

  it("builds public resume paths", () => {
    expect(getResumePdfPublicPath("cv-en.pdf")).toBe("/resume/cv-en.pdf");
  });
});
