import { skillsContent } from "@/data/skills.data";
import { getSkillsByCategory } from "@/lib/skills";

import type { SkillsRepository } from "@/content/domains/skills/repository";

export const staticSkillsRepository: SkillsRepository = {
  async get() {
    return skillsContent;
  },

  async getByCategory(category) {
    return getSkillsByCategory(skillsContent.entries, category);
  },
};
