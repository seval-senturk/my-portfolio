import { blogHomeService } from "@/services/content/blog-home.service";

export const blogHomeContentService = {
  get(options?: import("@/content/shared/types").ContentQueryOptions) {
    return blogHomeService.get(options);
  },
};
