import { educationHomeService } from "@/services/content/education-home.service";

export const educationHomeContentService = {
  get(options?: import("@/content/shared/types").ContentQueryOptions) {
    return educationHomeService.get(options);
  },
};
