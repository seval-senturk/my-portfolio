import type { ContentQueryOptions, FooterContent } from "@/content/shared/types";
import type { SiteRepository } from "@/content/domains/site/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaSiteRepository } from "@/repositories/prisma/site.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { IdentifiedStatItem } from "@/types/stats";
import type { SiteContent } from "@/content/domains/site/repository";

export class SiteService {
  constructor(private readonly repository: SiteRepository = prismaSiteRepository) {}

  get(options?: ContentQueryOptions): Promise<SiteContent> {
    const locale = resolveLocale(options);
    return cacheContent("site", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }

  getFooter(options?: ContentQueryOptions): Promise<FooterContent> {
    const locale = resolveLocale(options);
    return cacheContent("site-footer", [locale], () =>
      this.repository.getFooter({ ...options, locale }),
    );
  }

  getProfessionalHighlights(
    options?: ContentQueryOptions,
  ): Promise<readonly IdentifiedStatItem[]> {
    const locale = resolveLocale(options);
    return cacheContent("site-highlights", [locale], () =>
      this.repository.getProfessionalHighlights({ ...options, locale }),
    );
  }

  getSocialLinks(options?: ContentQueryOptions) {
    const locale = resolveLocale(options);
    return cacheContent("site-social-links", [locale], () =>
      this.repository.getSocialLinks({ ...options, locale }),
    );
  }
}

export const siteService = new SiteService();
