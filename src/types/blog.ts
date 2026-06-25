import type { ContentStatus } from "@/content/shared/types";

export type BlogPostStatus = ContentStatus | "scheduled";

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seo?: import("@/content/shared/types").SeoFields;
}

export interface BlogAuthor {
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentJson?: Record<string, unknown>;
  coverImage?: string;
  coverImageAlt?: string;
  author: BlogAuthor;
  readingTimeMinutes: number;
  featured: boolean;
  tagIds: readonly string[];
  categoryIds: readonly string[];
  tags?: readonly BlogTag[];
  categories?: readonly BlogCategory[];
  seo: import("@/content/shared/types").SeoFields;
  meta: import("@/content/shared/types").ContentMeta & {
    scheduledAt?: string;
  };
}

export interface BlogSectionHeader {
  title: string;
  description: string;
}

export interface BlogContent {
  section: BlogSectionHeader;
  posts: readonly BlogPost[];
  categories: readonly BlogCategory[];
  tags: readonly BlogTag[];
}

export interface BlogListFilters {
  locale?: string;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  year?: number;
  month?: number;
  query?: string;
}

export interface BlogRevisionSnapshot {
  postId: string;
  title: string;
  content: string;
  contentJson?: Record<string, unknown>;
  savedAt: string;
}
