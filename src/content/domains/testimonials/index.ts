import { testimonialsService } from "@/services/content/testimonials.service";

export const testimonialsContentService = {
  get(options?: import("@/content/shared/types").ContentQueryOptions) {
    return testimonialsService.get(options);
  },
};
