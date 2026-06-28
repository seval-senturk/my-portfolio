import { footerContent } from "@/data/footer.data";
import { professionalHighlights } from "@/data/professional-highlights.data";
import { socialLinks } from "@/config/social-links.config";

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

  async getSocialLinks() {
    return socialLinks.map((link, index) => ({
      id: link.platform,
      platform: link.platform,
      label: link.label,
      href: link.href,
      visible: true,
      sortOrder: index,
    }));
  },
};
