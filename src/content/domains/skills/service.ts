import type { ContentQueryOptions } from "@/content/shared/types";

import { skillsService } from "@/services/content/skills.service";
import type { SkillCategory, SkillEntry, SkillsContent } from "@/types/skills";

export const skillsContentService = {
  get(options?: ContentQueryOptions): Promise<SkillsContent> {
    return skillsService.get(options);
  },

  getByCategory(
    category: SkillCategory,
    options?: ContentQueryOptions,
  ): Promise<SkillEntry[]> {
    return skillsService.getByCategory(category, options);
  },
};
