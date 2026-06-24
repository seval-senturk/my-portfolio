import type { HeroRepository } from "@/content/domains/hero/repository";
import { prisma } from "@/lib/prisma";
import { mapHeroToContent } from "@/repositories/prisma/mappers/hero.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import {
  resolveLocale,
  toPrismaContentStatus,
} from "@/repositories/shared/locale";

export const prismaHeroRepository: HeroRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const hero = await prisma.hero.findFirst({
      where: {
        locale,
        status: toPrismaContentStatus(options?.status),
      },
    });

    if (!hero) {
      throw new ContentNotFoundError("Hero", locale);
    }

    return mapHeroToContent(hero);
  },
};
