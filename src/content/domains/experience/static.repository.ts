import { experienceContent } from "@/data/experience.data";

import type { ExperienceRepository } from "@/content/domains/experience/repository";

export const staticExperienceRepository: ExperienceRepository = {
  async get() {
    return experienceContent;
  },

  async getEntryById(id) {
    return experienceContent.entries.find((entry) => entry.id === id) ?? null;
  },
};
