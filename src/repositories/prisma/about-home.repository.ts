import type { AboutHomeRepository } from "@/content/domains/about-home/repository";
import { aboutHomeContent } from "@/data/about-home.data";
import { normalizeAboutHomeContent } from "@/lib/content/normalize-about-home-content";
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

    try {
      const locale = resolveLocale(options);
      const [config, featureCards] = await Promise.all([
        prisma.aboutHomeConfig.findUnique({ where: { locale } }),
        prisma.aboutHomeFeatureCard.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

      if (!config) {
        return aboutHomeContent;
      }

      return normalizeAboutHomeContent(mapAboutHomeToContent(config, featureCards));
    } catch (error) {
      console.error("[about-home.repository] Falling back to static about home content.", error);
      return aboutHomeContent;
    }
  },
};
