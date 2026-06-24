import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { BlogContent, BlogPost } from "@/types/blog";

export interface BlogRepository extends ContentRepository<BlogContent> {
  getPostBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<BlogPost | null>;
}

export type { ContentQueryOptions };
