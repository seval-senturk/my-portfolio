import type { ContentQueryOptions } from "@/content/shared/types";
import type { EducationHomeRepository } from "@/content/domains/education-home/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaEducationHomeRepository } from "@/repositories/prisma/education-home.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { EducationHomeContent } from "@/types/education-home";

export class EducationHomeService {
  constructor(
    private readonly repository: EducationHomeRepository = prismaEducationHomeRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<EducationHomeContent> {
    const locale = resolveLocale(options);
    return cacheContent("education-home", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const educationHomeService = new EducationHomeService();
