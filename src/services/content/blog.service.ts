import type { ContentQueryOptions } from "@/content/shared/types";
import { validateSlug } from "@/content/shared/validation";
import type { BlogRepository } from "@/content/domains/blog/repository";
import { prismaBlogRepository } from "@/repositories/prisma/blog.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { BlogContent, BlogListFilters, BlogPost } from "@/types/blog";

export class BlogService {
  constructor(
    private readonly repository: BlogRepository = prismaBlogRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<BlogContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null> {
    const error = validateSlug(slug);
    if (error) {
      return Promise.resolve(null);
    }

    return this.repository.getPostBySlug(slug, {
      ...options,
      locale: resolveLocale(options),
    });
  }

  getPostBySlugAnyStatus(slug: string, locale?: string): Promise<BlogPost | null> {
    const error = validateSlug(slug);
    if (error) return Promise.resolve(null);
    return this.repository.getPostBySlugAnyStatus(slug, locale);
  }

  listPublishedPosts(filters?: BlogListFilters): Promise<BlogPost[]> {
    return this.repository.listPublishedPosts({
      ...filters,
      locale: resolveLocale(filters),
    });
  }

  getFeaturedPosts(locale?: string, limit?: number): Promise<BlogPost[]> {
    return this.repository.getFeaturedPosts(locale ?? resolveLocale(), limit);
  }

  getRelatedPosts(postId: string, limit?: number): Promise<BlogPost[]> {
    return this.repository.getRelatedPosts(postId, limit);
  }
}

export const blogService = new BlogService();
