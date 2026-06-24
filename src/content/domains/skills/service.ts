import type { ContentQueryOptions } from "@/content/shared/types";

import { staticSkillsRepository } from "@/content/domains/skills/static.repository";
import type { SkillCategory, SkillEntry, SkillsContent } from "@/types/skills";

export const skillsContentService = {
  get(options?: ContentQueryOptions): Promise<SkillsContent> {
    return staticSkillsRepository.get(options);
  },

  getByCategory(
    category: SkillCategory,
    options?: ContentQueryOptions,
  ): Promise<SkillEntry[]> {
    return staticSkillsRepository.getByCategory(category, options);
  },
};
