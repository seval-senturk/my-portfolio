import { footerContent } from "@/data/footer.data";
import { professionalHighlights } from "@/data/professional-highlights.data";

import type { SiteRepository } from "@/content/domains/site/repository";

export const staticSiteRepository: SiteRepository = {
  async get() {
    return {
      footer: footerContent,
      professionalHighlights,
    };
  },

  async getFooter() {
    return footerContent;
  },

  async getProfessionalHighlights() {
    return professionalHighlights;
  },
};
