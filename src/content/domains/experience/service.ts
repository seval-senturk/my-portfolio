import type { ContentQueryOptions } from "@/content/shared/types";

import { staticExperienceRepository } from "@/content/domains/experience/static.repository";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";

export const experienceContentService = {
  get(options?: ContentQueryOptions): Promise<ExperienceContent> {
    return staticExperienceRepository.get(options);
  },

  getEntryById(
    id: string,
    options?: ContentQueryOptions,
  ): Promise<ExperienceEntry | null> {
    return staticExperienceRepository.getEntryById(id, options);
  },
};
