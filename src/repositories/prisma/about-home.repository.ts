import type { AboutHomeRepository } from "@/content/domains/about-home/repository";
import { aboutHomeContent } from "@/data/about-home.data";
import { prisma } from "@/lib/prisma";
import { mapAboutHomeToContent } from "@/repositories/prisma/mappers/about-home.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasAboutHomeModels(): boolean {
  return (
    "aboutHomeConfig" in prisma &&
    "aboutHomeQuickInfo" in prisma &&
    "aboutHomeStat" in prisma &&
    typeof prisma.aboutHomeConfig?.findUnique === "function"
  );
}

export const prismaAboutHomeRepository: AboutHomeRepository = {
  async get(options) {
    if (!hasAboutHomeModels()) {
      return aboutHomeContent;
    }

    const locale = resolveLocale(options);
    const [config, quickInfo, stats] = await Promise.all([
      prisma.aboutHomeConfig.findUnique({ where: { locale } }),
      prisma.aboutHomeQuickInfo.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.aboutHomeStat.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    if (!config) {
      return aboutHomeContent;
    }

    return mapAboutHomeToContent(config, quickInfo, stats);
  },
};
