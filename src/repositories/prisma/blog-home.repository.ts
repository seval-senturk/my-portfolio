import type { BlogHomeRepository } from "@/content/domains/blog-home/repository";
import { blogHomeContent } from "@/data/blog-home.data";
import { prisma } from "@/lib/prisma";
import { mapBlogHomeToContent } from "@/repositories/prisma/mappers/blog-home.mapper";
import { resolveLocale } from "@/repositories/shared/locale";
import type { BlogHomeSelectionMode } from "@/types/blog-home";
import type { Prisma } from "@prisma/client";

const postInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
} as const;

function hasBlogHomeModels(): boolean {
  return (
    "blogHomeSectionConfig" in prisma &&
    typeof prisma.blogHomeSectionConfig?.findUnique === "function"
  );
}

async function loadSeoByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map<string, import("@prisma/client").SeoMetadata>();
  }

  const seoRecords = await prisma.seoMetadata.findMany({
    where: {
      entityType: "blog_post",
      entityId: { in: postIds },
    },
  });

  return new Map(seoRecords.map((seo) => [seo.entityId, seo]));
}

async function fetchPostsForMode(
  locale: string,
  mode: BlogHomeSelectionMode,
  limit: number,
) {
  if (mode === "curated") {
    const curated = await prisma.blogHomeCuratedPost.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
      include: {
        blogPost: {
          include: postInclude,
        },
      },
    });

    return curated
      .map((entry) => entry.blogPost)
      .filter((post) => post.status === "PUBLISHED" && post.locale === locale);
  }

  const where: Prisma.BlogPostWhereInput = {
    locale,
    status: "PUBLISHED",
  };

  if (mode === "featured") {
    where.featured = true;
  }

  return prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: postInclude,
  });
}

export const prismaBlogHomeRepository: BlogHomeRepository = {
  async get(options) {
    if (!hasBlogHomeModels()) {
      return blogHomeContent;
    }

    const locale = resolveLocale(options);
    const config = await prisma.blogHomeSectionConfig.findUnique({
      where: { locale },
    });

    if (!config) {
      return blogHomeContent;
    }

    const posts = await fetchPostsForMode(
      locale,
      config.selectionMode as BlogHomeSelectionMode,
      config.postLimit,
    );
    const seoByPostId = await loadSeoByPostIds(posts.map((post) => post.id));

    return mapBlogHomeToContent(config, posts, seoByPostId);
  },
};
