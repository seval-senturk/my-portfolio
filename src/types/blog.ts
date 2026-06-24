import type { ContentMeta, SeoFields } from "@/content/shared/types";

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
  seo?: SeoFields;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tagIds: readonly string[];
  categoryIds: readonly string[];
  seo: SeoFields;
  meta: ContentMeta;
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
