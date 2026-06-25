import type { ContentQueryOptions } from "@/content/shared/types";

import { blogService } from "@/services/content/blog.service";
import type { BlogContent, BlogListFilters, BlogPost } from "@/types/blog";

export const blogContentService = {
  get(options?: ContentQueryOptions): Promise<BlogContent> {
    return blogService.get(options);
  },

  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null> {
    return blogService.getPostBySlug(slug, options);
  },

  listPublishedPosts(filters?: BlogListFilters): Promise<BlogPost[]> {
    return blogService.listPublishedPosts(filters);
  },

  getFeaturedPosts(locale?: string, limit?: number): Promise<BlogPost[]> {
    return blogService.getFeaturedPosts(locale, limit);
  },

  getRelatedPosts(postId: string, limit?: number): Promise<BlogPost[]> {
    return blogService.getRelatedPosts(postId, limit);
  },
};
