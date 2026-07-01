import type { ContentQueryOptions } from "@/content/shared/types";
import type { AboutHomeRepository } from "@/content/domains/about-home/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaAboutHomeRepository } from "@/repositories/prisma/about-home.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { AboutHomeContent } from "@/types/about-home";

export class AboutHomeService {
  constructor(
    private readonly repository: AboutHomeRepository = prismaAboutHomeRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<AboutHomeContent> {
    const locale = resolveLocale(options);
    return cacheContent("about-home", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const aboutHomeService = new AboutHomeService();
