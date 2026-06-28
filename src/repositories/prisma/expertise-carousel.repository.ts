import type { ExpertiseCarouselRepository } from "@/content/domains/expertise-carousel/repository";
import { expertiseCarouselContent } from "@/data/expertise-carousel.data";
import { prisma } from "@/lib/prisma";
import { mapExpertiseCarouselToContent } from "@/repositories/prisma/mappers/expertise-carousel.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasExpertiseCarouselModels(): boolean {
  return (
    "expertiseCarouselConfig" in prisma &&
    "expertiseCarouselItem" in prisma &&
    typeof prisma.expertiseCarouselConfig?.findUnique === "function"
  );
}

export const prismaExpertiseCarouselRepository: ExpertiseCarouselRepository = {
  async get(options) {
    if (!hasExpertiseCarouselModels()) {
      return expertiseCarouselContent;
    }

    const locale = resolveLocale(options);
    const [config, items] = await Promise.all([
      prisma.expertiseCarouselConfig.findUnique({ where: { locale } }),
      prisma.expertiseCarouselItem.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    if (!config) {
      return expertiseCarouselContent;
    }

    return mapExpertiseCarouselToContent(config, items);
  },
};
