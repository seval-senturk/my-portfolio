import type { ContentQueryOptions } from "@/content/shared/types";

import { staticAboutRepository } from "@/content/domains/about/static.repository";
import type { AboutContent } from "@/types/about";

export const aboutContentService = {
  get(options?: ContentQueryOptions): Promise<AboutContent> {
    return staticAboutRepository.get(options);
  },
};
