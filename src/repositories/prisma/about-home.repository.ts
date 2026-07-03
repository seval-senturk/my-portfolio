import type { AboutHomeRepository } from "@/content/domains/about-home/repository";
import { aboutHomeContent } from "@/data/about-home.data";
import { prisma } from "@/lib/prisma";
import { mapAboutHomeToContent } from "@/repositories/prisma/mappers/about-home.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasAboutHomeModels(): boolean {
  return (
    "aboutHomeConfig" in prisma &&
    "aboutHomeFeatureCard" in prisma &&
    typeof prisma.aboutHomeConfig?.findUnique === "function"
  );
}

export const prismaAboutHomeRepository: AboutHomeRepository = {
  async get(options) {
    if (!hasAboutHomeModels()) {
      return aboutHomeContent;
    }

    const locale = resolveLocale(options);
    const [config, featureCards] = await Promise.all([
      prisma.aboutHomeConfig.findUnique({ where: { locale } }),
      prisma.aboutHomeFeatureCard.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    if (!config) {
      return aboutHomeContent;
    }

    const mapped = mapAboutHomeToContent(config, featureCards);

    return {
      ...mapped,
      featureCards:
        mapped.featureCards.length > 0 ? mapped.featureCards : aboutHomeContent.featureCards,
    };
  },
};
