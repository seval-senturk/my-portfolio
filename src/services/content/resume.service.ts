import type { ContentQueryOptions } from "@/content/shared/types";
import type { ResumeRepository } from "@/content/domains/resume/repository";
import { prismaResumeRepository } from "@/repositories/prisma/resume.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ResumeContent, ResumeFile } from "@/types/resume";

export class ResumeService {
  constructor(
    private readonly repository: ResumeRepository = prismaResumeRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ResumeContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getDefaultFile(options?: ContentQueryOptions): Promise<ResumeFile | null> {
    return this.repository.getDefaultFile({
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const resumeService = new ResumeService();
