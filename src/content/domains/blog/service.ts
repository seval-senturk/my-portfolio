import type { ContentQueryOptions } from "@/content/shared/types";

import { blogService } from "@/services/content/blog.service";
import type { BlogContent, BlogPost } from "@/types/blog";

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
};
