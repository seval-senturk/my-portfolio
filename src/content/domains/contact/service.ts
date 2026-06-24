import type { ContentQueryOptions } from "@/content/shared/types";

import { staticContactRepository } from "@/content/domains/contact/static.repository";
import type { ContactContent } from "@/types/contact";

export const contactContentService = {
  get(options?: ContentQueryOptions): Promise<ContactContent> {
    return staticContactRepository.get(options);
  },
};
