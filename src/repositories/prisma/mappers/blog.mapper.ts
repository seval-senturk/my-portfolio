import type {
  BlogPageConfig,
  BlogPost,
  Category,
  SeoMetadata,
  Tag,
} from "@prisma/client";

import { mapSeoFields } from "@/repositories/prisma/mappers/shared.mapper";
import type { BlogContent, BlogPost as BlogPostType } from "@/types/blog";
import type { ContentMeta, ContentStatus } from "@/content/shared/types";

type BlogPostWithRelations = BlogPost & {
  categories: { category: Category }[];
  tags: { tag: Tag }[];
};

function toContentStatus(status: BlogPost["status"]): ContentStatus {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "ARCHIVED":
      return "archived";
    default:
      return "published";
  }
}

export function mapBlogPostToContent(
  post: BlogPostWithRelations,
  seo: SeoMetadata | null,
): BlogPostType {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImageUrl ?? undefined,
    tagIds: post.tags.map((item) => item.tag.id),
    categoryIds: post.categories.map((item) => item.category.id),
    seo: mapSeoFields(seo),
    meta: {
      id: post.id,
      slug: post.slug,
      locale: post.locale,
      status: toContentStatus(post.status),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString(),
    } satisfies ContentMeta,
  };
}

export function mapBlogToContent(
  config: BlogPageConfig,
  posts: BlogPostWithRelations[],
  categories: Category[],
  tags: Tag[],
  seoByPostId: Map<string, SeoMetadata>,
): BlogContent {
  return {
    section: {
      title: config.sectionTitle,
      description: config.sectionDescription,
    },
    posts: posts.map((post) =>
      mapBlogPostToContent(post, seoByPostId.get(post.id) ?? null),
    ),
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
    })),
    tags: tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  };
}
