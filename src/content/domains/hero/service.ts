import type { ContentQueryOptions } from "@/content/shared/types";

import { heroService } from "@/services/content/hero.service";
import type { HeroContent } from "@/types/hero";

export const heroContentService = {
  get(options?: ContentQueryOptions): Promise<HeroContent> {
    return heroService.get(options);
  },
};
