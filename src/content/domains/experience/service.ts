import type { ContentQueryOptions } from "@/content/shared/types";

import { experienceService } from "@/services/content/experience.service";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";

export const experienceContentService = {
  get(options?: ContentQueryOptions): Promise<ExperienceContent> {
    return experienceService.get(options);
  },

  getEntryById(
    id: string,
    options?: ContentQueryOptions,
  ): Promise<ExperienceEntry | null> {
    return experienceService.getEntryById(id, options);
  },
};
