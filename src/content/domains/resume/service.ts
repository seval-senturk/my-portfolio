import type { ContentQueryOptions } from "@/content/shared/types";

import { resumeService } from "@/services/content/resume.service";
import type { ResumeContent, ResumeFile } from "@/types/resume";

export const resumeContentService = {
  get(options?: ContentQueryOptions): Promise<ResumeContent> {
    return resumeService.get(options);
  },

  getDefaultFile(options?: ContentQueryOptions): Promise<ResumeFile | null> {
    return resumeService.getDefaultFile(options);
  },
};
