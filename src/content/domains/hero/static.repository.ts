import { heroContent } from "@/data/hero.data";

import type { HeroRepository } from "@/content/domains/hero/repository";

export const staticHeroRepository: HeroRepository = {
  async get() {
    return heroContent;
  },
};
