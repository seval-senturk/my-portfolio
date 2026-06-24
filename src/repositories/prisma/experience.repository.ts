import type { ExperienceRepository } from "@/content/domains/experience/repository";
import { prisma } from "@/lib/prisma";
import {
  mapExperienceEntry,
  mapExperienceToContent,
} from "@/repositories/prisma/mappers/experience.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

const experienceInclude = {
  technologies: {
    include: { technology: true },
  },
} as const;

export const prismaExperienceRepository: ExperienceRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const [config, entries] = await Promise.all([
      prisma.experiencePageConfig.findUnique({ where: { locale } }),
      prisma.experience.findMany({
        orderBy: { sortOrder: "asc" },
        include: experienceInclude,
      }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Experience page config", locale);
    }

    return mapExperienceToContent(config, entries);
  },

  async getEntryById(id) {
    const entry = await prisma.experience.findUnique({
      where: { id },
      include: experienceInclude,
    });

    return entry ? mapExperienceEntry(entry) : null;
  },
};
