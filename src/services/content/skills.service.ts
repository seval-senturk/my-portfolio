import type { ContentQueryOptions } from "@/content/shared/types";
import type { SkillsRepository } from "@/content/domains/skills/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaSkillsRepository } from "@/repositories/prisma/skills.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { SkillCategory, SkillEntry, SkillsContent } from "@/types/skills";

export class SkillsService {
  constructor(
    private readonly repository: SkillsRepository = prismaSkillsRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<SkillsContent> {
    const locale = resolveLocale(options);
    return cacheContent("skills", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
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
