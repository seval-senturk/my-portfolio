import type { ContentQueryOptions, FooterContent } from "@/content/shared/types";

import { staticSiteRepository } from "@/content/domains/site/static.repository";
import type { SiteContent } from "@/content/domains/site/repository";
import type { IdentifiedStatItem } from "@/types/stats";

export const siteContentService = {
  get(options?: ContentQueryOptions): Promise<SiteContent> {
    return staticSiteRepository.get(options);
  },

  getFooter(options?: ContentQueryOptions): Promise<FooterContent> {
    return staticSiteRepository.getFooter(options);
  },

  getProfessionalHighlights(
    options?: ContentQueryOptions,
  ): Promise<readonly IdentifiedStatItem[]> {
    return staticSiteRepository.getProfessionalHighlights(options);
  },
};
