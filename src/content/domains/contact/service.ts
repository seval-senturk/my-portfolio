import type { ContentQueryOptions } from "@/content/shared/types";

import { contactContentServiceLayer } from "@/services/content/contact.service";
import type { ContactContent } from "@/types/contact";

export const contactContentService = {
  get(options?: ContentQueryOptions): Promise<ContactContent> {
    return contactContentServiceLayer.get(options);
  },
};
