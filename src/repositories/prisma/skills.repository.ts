import type { SkillsRepository } from "@/content/domains/skills/repository";
import { prisma } from "@/lib/prisma";
import {
  mapSkillEntry,
  mapSkillsToContent,
} from "@/repositories/prisma/mappers/skills.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

export const prismaSkillsRepository: SkillsRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const [config, skills] = await Promise.all([
      prisma.skillsPageConfig.findUnique({ where: { locale } }),
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Skills page config", locale);
    }

    return mapSkillsToContent(config, skills);
  },

  async getByCategory(category) {
    const skills = await prisma.skill.findMany({
      where: { category },
      orderBy: { sortOrder: "asc" },
    });

    return skills.map(mapSkillEntry);
  },
};
