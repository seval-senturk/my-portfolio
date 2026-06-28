import type { ContentQueryOptions } from "@/content/shared/types";
import { validateSlug } from "@/content/shared/validation";
import type { BlogRepository } from "@/content/domains/blog/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaBlogRepository } from "@/repositories/prisma/blog.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { BlogContent, BlogListFilters, BlogPost } from "@/types/blog";

export class BlogService {
  constructor(
    private readonly repository: BlogRepository = prismaBlogRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<BlogContent> {
    const locale = resolveLocale(options);
    return cacheContent("blog", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }

  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null> {
    const error = validateSlug(slug);
    if (error) {
      return Promise.resolve(null);
    }

    const locale = resolveLocale(options);
    return cacheContent("blog-post", [locale, slug], () =>
      this.repository.getPostBySlug(slug, { ...options, locale }),
    );
  }

  getPostBySlugAnyStatus(slug: string, locale?: string): Promise<BlogPost | null> {
    const error = validateSlug(slug);
    if (error) return Promise.resolve(null);
    return this.repository.getPostBySlugAnyStatus(slug, locale);
  }

  listPublishedPosts(filters?: BlogListFilters): Promise<BlogPost[]> {
    const locale = resolveLocale(filters);
    const keyParts = [
      locale,
      filters?.categorySlug ?? "all",
      filters?.tagSlug ?? "all",
      String(filters?.featured ?? false),
      String(filters?.year ?? ""),
      String(filters?.month ?? ""),
      filters?.query ?? "",
    ];
    return cacheContent("blog-list", keyParts, () =>
      this.repository.listPublishedPosts({ ...filters, locale }),
    );
  }

  getFeaturedPosts(locale?: string, limit?: number): Promise<BlogPost[]> {
    const resolvedLocale = locale ?? resolveLocale();
    const resolvedLimit = String(limit ?? 3);
    return cacheContent("blog-featured", [resolvedLocale, resolvedLimit], () =>
      this.repository.getFeaturedPosts(resolvedLocale, limit),
    );
  }

  getRelatedPosts(postId: string, limit?: number): Promise<BlogPost[]> {
    const resolvedLimit = String(limit ?? 3);
    return cacheContent("blog-related", [postId, resolvedLimit], () =>
      this.repository.getRelatedPosts(postId, limit),
    );
  }
}

export const blogService = new BlogService();
