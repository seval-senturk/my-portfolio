import { resumeContent } from "@/data/resume.data";
import { getDefaultResumeFile } from "@/lib/resume";

import type { ResumeRepository } from "@/content/domains/resume/repository";

export const staticResumeRepository: ResumeRepository = {
  async get() {
    return resumeContent;
  },

  async getDefaultFile() {
    return getDefaultResumeFile(resumeContent.files) ?? null;
  },
};
