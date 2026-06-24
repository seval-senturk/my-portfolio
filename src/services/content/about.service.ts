import type { ContentQueryOptions } from "@/content/shared/types";
import type { AboutRepository } from "@/content/domains/about/repository";
import { prismaAboutRepository } from "@/repositories/prisma/about.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { AboutContent } from "@/types/about";

export class AboutService {
  constructor(
    private readonly repository: AboutRepository = prismaAboutRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<AboutContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }
}

export const aboutService = new AboutService();
