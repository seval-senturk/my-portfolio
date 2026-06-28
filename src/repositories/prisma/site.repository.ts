import type { SiteRepository } from "@/content/domains/site/repository";
import { prisma } from "@/lib/prisma";
import { mapSiteToContent } from "@/repositories/prisma/mappers/site.mapper";
import { fromJson } from "@/repositories/prisma/mappers/json";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";
import type { SocialPlatform } from "@/config/social-links.config";
import type { IdentifiedStatItem } from "@/types/stats";
import type { SiteSocialLink } from "@/types/social";

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
    const locale = resolveLocale(options);
    const settings = await prisma.siteSettings.findUnique({
      where: { locale },
      select: {
        footerTagline: true,
        footerQuickLinksLabel: true,
        footerConnectLabel: true,
        footerCopyrightSuffix: true,
      },
    });

    if (!settings) {
      throw new ContentNotFoundError("Site settings", locale);
    }

    return {
      tagline: settings.footerTagline,
      columns: {
        quickLinks: settings.footerQuickLinksLabel,
        connect: settings.footerConnectLabel,
      },
      copyrightSuffix: settings.footerCopyrightSuffix,
    };
  },

  async getProfessionalHighlights(options) {
    const locale = resolveLocale(options);
    const settings = await prisma.siteSettings.findUnique({
      where: { locale },
      select: { professionalHighlights: true },
    });

    if (!settings) {
      throw new ContentNotFoundError("Site settings", locale);
    }

    return fromJson<readonly IdentifiedStatItem[]>(settings.professionalHighlights);
  },

  async getSocialLinks(options) {
    const locale = resolveLocale(options);
    const settings = await prisma.siteSettings.findUnique({
      where: { locale },
      select: {
        socialLinks: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!settings) {
      throw new ContentNotFoundError("Site settings", locale);
    }

    return settings.socialLinks.map(
      (link): SiteSocialLink => ({
        id: link.id,
        platform: link.platform as SocialPlatform,
        label: link.label,
        href: link.href,
        visible: link.visible,
        sortOrder: link.sortOrder,
      }),
    );
  },
};
