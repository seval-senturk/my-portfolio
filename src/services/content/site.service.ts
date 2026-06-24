import type { ContentQueryOptions, FooterContent } from "@/content/shared/types";
import type { SiteRepository } from "@/content/domains/site/repository";
import { prismaSiteRepository } from "@/repositories/prisma/site.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { IdentifiedStatItem } from "@/types/stats";
import type { SiteContent } from "@/content/domains/site/repository";

export class SiteService {
  constructor(private readonly repository: SiteRepository = prismaSiteRepository) {}

  get(options?: ContentQueryOptions): Promise<SiteContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getFooter(options?: ContentQueryOptions): Promise<FooterContent> {
    return this.repository.getFooter({
      ...options,
      locale: resolveLocale(options),
    });
  }

  getProfessionalHighlights(
    options?: ContentQueryOptions,
  ): Promise<readonly IdentifiedStatItem[]> {
    return this.repository.getProfessionalHighlights({
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const siteService = new SiteService();
