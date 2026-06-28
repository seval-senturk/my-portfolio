import type { ContentQueryOptions } from "@/content/shared/types";
import type { ResumeRepository } from "@/content/domains/resume/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaResumeRepository } from "@/repositories/prisma/resume.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ResumeContent, ResumeFile } from "@/types/resume";

export class ResumeService {
  constructor(
    private readonly repository: ResumeRepository = prismaResumeRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ResumeContent> {
    const locale = resolveLocale(options);
    return cacheContent("resume", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }

  getDefaultFile(options?: ContentQueryOptions): Promise<ResumeFile | null> {
    return this.repository.getDefaultFile({
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const resumeService = new ResumeService();
