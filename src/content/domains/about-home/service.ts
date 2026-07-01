import type { ContentQueryOptions } from "@/content/shared/types";
import { aboutHomeService } from "@/services/content/about-home.service";

export const aboutHomeContentService = {
  get(options?: ContentQueryOptions) {
    return aboutHomeService.get(options);
  },
};
