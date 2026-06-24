import type { ContentQueryOptions } from "@/content/shared/types";

import { aboutService } from "@/services/content/about.service";
import type { AboutContent } from "@/types/about";

export const aboutContentService = {
  get(options?: ContentQueryOptions): Promise<AboutContent> {
    return aboutService.get(options);
  },
};
