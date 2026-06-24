import type { ContentQueryOptions } from "@/content/shared/types";

import { staticHeroRepository } from "@/content/domains/hero/static.repository";
import type { HeroContent } from "@/types/hero";

export const heroContentService = {
  get(options?: ContentQueryOptions): Promise<HeroContent> {
    return staticHeroRepository.get(options);
  },
};
