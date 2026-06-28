import type { ContentQueryOptions } from "@/content/shared/types";
import type { FooterRepository } from "@/content/domains/footer/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaFooterRepository } from "@/repositories/prisma/footer.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { SiteFooterContent } from "@/types/footer";

export class FooterService {
  constructor(
    private readonly repository: FooterRepository = prismaFooterRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<SiteFooterContent> {
    const locale = resolveLocale(options);
    return cacheContent("site-footer-v2", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const footerService = new FooterService();
