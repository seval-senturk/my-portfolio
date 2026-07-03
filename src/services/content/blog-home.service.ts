import type { ContentQueryOptions } from "@/content/shared/types";
import type { BlogHomeRepository } from "@/content/domains/blog-home/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaBlogHomeRepository } from "@/repositories/prisma/blog-home.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { BlogHomeContent } from "@/types/blog-home";

export class BlogHomeService {
  constructor(
    private readonly repository: BlogHomeRepository = prismaBlogHomeRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<BlogHomeContent> {
    const locale = resolveLocale(options);
    return cacheContent("blog-home", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const blogHomeService = new BlogHomeService();
