import type { ContentQueryOptions } from "@/content/shared/types";
import type { HeroRepository } from "@/content/domains/hero/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaHeroRepository } from "@/repositories/prisma/hero.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { HeroContent } from "@/types/hero";

export class HeroService {
  constructor(private readonly repository: HeroRepository = prismaHeroRepository) {}

  get(options?: ContentQueryOptions): Promise<HeroContent> {
    const locale = resolveLocale(options);

    if (!locale.trim()) {
      throw new Error("Locale is required to load hero content.");
    }

    return cacheContent("hero", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const heroService = new HeroService();
