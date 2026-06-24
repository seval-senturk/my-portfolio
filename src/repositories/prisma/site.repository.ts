import type { SiteRepository } from "@/content/domains/site/repository";
import { prisma } from "@/lib/prisma";
import { mapSiteToContent } from "@/repositories/prisma/mappers/site.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

export const prismaSiteRepository: SiteRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const settings = await prisma.siteSettings.findUnique({ where: { locale } });

    if (!settings) {
      throw new ContentNotFoundError("Site settings", locale);
    }

    return mapSiteToContent(settings);
  },

  async getFooter(options) {
    const content = await this.get(options);
    return content.footer;
  },

  async getProfessionalHighlights(options) {
    const content = await this.get(options);
    return content.professionalHighlights;
  },
};
