import type {
  BlogHomeCuratedPost,
  BlogHomeSectionConfig,
  BlogPost,
  Category,
  SeoMetadata,
  Tag,
} from "@prisma/client";

import { mapBlogPostToContent } from "@/repositories/prisma/mappers/blog.mapper";
import type { BlogHomeContent, BlogHomeSelectionMode } from "@/types/blog-home";

type BlogPostWithRelations = BlogPost & {
  categories: { category: Category }[];
  tags: { tag: Tag }[];
};

function parseSelectionMode(value: string): BlogHomeSelectionMode {
  if (value === "featured" || value === "curated") {
    return value;
  }
  return "latest";
}

export function mapBlogHomeToContent(
  config: BlogHomeSectionConfig,
  posts: BlogPostWithRelations[],
  seoByPostId: Map<string, SeoMetadata>,
): BlogHomeContent {
  return {
    section: {
      label: config.label,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
      sectionNumber: config.sectionNumber,
      visible: config.visible,
      postLimit: config.postLimit,
      selectionMode: parseSelectionMode(config.selectionMode),
      readMoreLabel: config.readMoreLabel,
      ctaLabel: config.ctaLabel,
      ctaHref: config.ctaHref,
      carousel: {
        enabled: config.carouselEnabled,
        autoplay: config.autoplay,
        autoplayDelayMs: config.autoplayDelayMs,
        loop: config.loop,
      },
    },
    posts: posts.map((post) =>
      mapBlogPostToContent(post, seoByPostId.get(post.id) ?? null),
    ),
  };
}

export function mapBlogHomeCuratedEntry(entry: BlogHomeCuratedPost) {
  return {
    id: entry.id,
    blogPostId: entry.blogPostId,
    sortOrder: entry.sortOrder,
    visible: entry.visible,
  };
}
