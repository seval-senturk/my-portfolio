import type { ContentQueryOptions } from "@/content/shared/types";
import type { AboutRepository } from "@/content/domains/about/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaAboutRepository } from "@/repositories/prisma/about.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { AboutContent } from "@/types/about";

export class AboutService {
  constructor(
    private readonly repository: AboutRepository = prismaAboutRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<AboutContent> {
    const locale = resolveLocale(options);
    return cacheContent("about", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const aboutService = new AboutService();
