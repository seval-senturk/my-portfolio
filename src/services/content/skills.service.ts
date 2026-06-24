import type { ContentQueryOptions } from "@/content/shared/types";
import type { SkillsRepository } from "@/content/domains/skills/repository";
import { prismaSkillsRepository } from "@/repositories/prisma/skills.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { SkillCategory, SkillEntry, SkillsContent } from "@/types/skills";

export class SkillsService {
  constructor(
    private readonly repository: SkillsRepository = prismaSkillsRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<SkillsContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getByCategory(
    category: SkillCategory,
    options?: ContentQueryOptions,
  ): Promise<SkillEntry[]> {
    return this.repository.getByCategory(category, {
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const skillsService = new SkillsService();
