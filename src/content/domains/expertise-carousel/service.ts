import type { ContentQueryOptions } from "@/content/shared/types";

import { expertiseCarouselService } from "@/services/content/expertise-carousel.service";
import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";

export const expertiseCarouselContentService = {
  get(options?: ContentQueryOptions): Promise<ExpertiseCarouselContent> {
    return expertiseCarouselService.get(options);
  },
};
