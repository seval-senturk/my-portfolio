import type { EducationHomeRepository } from "@/content/domains/education-home/repository";
import { prisma } from "@/lib/prisma";
import { mapEducationHomeToContent } from "@/repositories/prisma/mappers/education-home.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

export const prismaEducationHomeRepository: EducationHomeRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const [config, entries] = await Promise.all([
      prisma.educationHomeConfig.findUnique({ where: { locale } }),
      prisma.educationHomeEntry.findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Education home config", locale);
    }

    return mapEducationHomeToContent(config, entries);
  },
};
