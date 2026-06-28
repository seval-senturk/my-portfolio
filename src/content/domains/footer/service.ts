import type { ContentQueryOptions } from "@/content/shared/types";
import { footerService } from "@/services/content/footer.service";

export const footerContentService = {
  get(options?: ContentQueryOptions) {
    return footerService.get(options);
  },
};
