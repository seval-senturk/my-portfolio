import type { ContentQueryOptions } from "@/content/shared/types";

import { staticResumeRepository } from "@/content/domains/resume/static.repository";
import type { ResumeContent, ResumeFile } from "@/types/resume";

export const resumeContentService = {
  get(options?: ContentQueryOptions): Promise<ResumeContent> {
    return staticResumeRepository.get(options);
  },

  getDefaultFile(options?: ContentQueryOptions): Promise<ResumeFile | null> {
    return staticResumeRepository.getDefaultFile(options);
  },
};
