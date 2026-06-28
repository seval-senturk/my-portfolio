import type { ContentQueryOptions, FooterContent } from "@/content/shared/types";

import type { SiteContent } from "@/content/domains/site/repository";
import { siteService } from "@/services/content/site.service";
import type { IdentifiedStatItem } from "@/types/stats";

export const siteContentService = {
  get(options?: ContentQueryOptions): Promise<SiteContent> {
    return siteService.get(options);
  },

  getFooter(options?: ContentQueryOptions): Promise<FooterContent> {
    return siteService.getFooter(options);
  },

  getProfessionalHighlights(
    options?: ContentQueryOptions,
  ): Promise<readonly IdentifiedStatItem[]> {
    return siteService.getProfessionalHighlights(options);
  },

  getSocialLinks(options?: ContentQueryOptions) {
    return siteService.getSocialLinks(options);
  },
};
