import type { ContentQueryOptions } from "@/content/shared/types";

import { staticBlogRepository } from "@/content/domains/blog/static.repository";
import type { BlogContent, BlogPost } from "@/types/blog";

export const blogContentService = {
  get(options?: ContentQueryOptions): Promise<BlogContent> {
    return staticBlogRepository.get(options);
  },

  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null> {
    return staticBlogRepository.getPostBySlug(slug, options);
  },
};
