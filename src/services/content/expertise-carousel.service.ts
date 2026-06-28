import type { ContentQueryOptions } from "@/content/shared/types";
import type { ExpertiseCarouselRepository } from "@/content/domains/expertise-carousel/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaExpertiseCarouselRepository } from "@/repositories/prisma/expertise-carousel.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";

export class ExpertiseCarouselService {
  constructor(
    private readonly repository: ExpertiseCarouselRepository = prismaExpertiseCarouselRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ExpertiseCarouselContent> {
    const locale = resolveLocale(options);
    return cacheContent("expertise-carousel", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const expertiseCarouselService = new ExpertiseCarouselService();
