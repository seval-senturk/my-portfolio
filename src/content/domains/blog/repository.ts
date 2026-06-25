import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { BlogContent, BlogListFilters, BlogPost } from "@/types/blog";

export interface BlogRepository extends ContentRepository<BlogContent> {
  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null>;

  getPostBySlugAnyStatus(slug: string, locale?: string): Promise<BlogPost | null>;

  listPublishedPosts(filters?: BlogListFilters): Promise<BlogPost[]>;

  getFeaturedPosts(locale?: string, limit?: number): Promise<BlogPost[]>;

  getRelatedPosts(postId: string, limit?: number): Promise<BlogPost[]>;
}

export type { ContentQueryOptions };
