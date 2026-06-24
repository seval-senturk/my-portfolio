import type { ContentQueryOptions } from "@/content/shared/types";
import type { ExperienceRepository } from "@/content/domains/experience/repository";
import { prismaExperienceRepository } from "@/repositories/prisma/experience.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";

export class ExperienceService {
  constructor(
    private readonly repository: ExperienceRepository = prismaExperienceRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ExperienceContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getEntryById(
    id: string,
    options?: ContentQueryOptions,
  ): Promise<ExperienceEntry | null> {
    if (!id.trim()) {
      return Promise.resolve(null);
    }

    return this.repository.getEntryById(id, {
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const experienceService = new ExperienceService();
