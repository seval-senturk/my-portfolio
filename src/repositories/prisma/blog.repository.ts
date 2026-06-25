import type { BlogRepository } from "@/content/domains/blog/repository";
import { prisma } from "@/lib/prisma";
import {
  mapBlogPostToContent,
  mapBlogToContent,
} from "@/repositories/prisma/mappers/blog.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import {
  resolveLocale,
  toPrismaContentStatus,
} from "@/repositories/shared/locale";
import type { BlogListFilters } from "@/types/blog";
import type { Prisma, Category, Tag } from "@prisma/client";

const postInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
} as const;

async function loadSeoByPostIds(postIds: string[]) {
  if (postIds.length === 0) {
    return new Map();
  }

  const seoRecords = await prisma.seoMetadata.findMany({
    where: {
      entityType: "blog_post",
      entityId: { in: postIds },
    },
  });

  return new Map(seoRecords.map((seo) => [seo.entityId, seo]));
}

function buildPublishedWhere(filters?: BlogListFilters): Prisma.BlogPostWhereInput {
  const locale = resolveLocale(filters);
  const where: Prisma.BlogPostWhereInput = {
    locale,
    status: "PUBLISHED",
  };

  if (filters?.featured) {
    where.featured = true;
  }

  if (filters?.categorySlug) {
    where.categories = {
      some: { category: { slug: filters.categorySlug, type: "BLOG" } },
    };
  }

  if (filters?.tagSlug) {
    where.tags = {
      some: { tag: { slug: filters.tagSlug } },
    };
  }

  if (filters?.year) {
    const start = new Date(filters.year, (filters.month ?? 1) - 1, 1);
    const end = filters.month
      ? new Date(filters.year, filters.month, 1)
      : new Date(filters.year + 1, 0, 1);

    where.publishedAt = {
      gte: start,
      lt: end,
    };
  }

  if (filters?.query?.trim()) {
    where.OR = [
      { title: { contains: filters.query.trim(), mode: "insensitive" } },
      { excerpt: { contains: filters.query.trim(), mode: "insensitive" } },
      { searchText: { contains: filters.query.trim(), mode: "insensitive" } },
    ];
  }

  return where;
}

async function mapPostsWithSeo(
  posts: Array<
    Awaited<ReturnType<typeof prisma.blogPost.findMany>>[number] & {
      categories: { category: Category }[];
      tags: { tag: Tag }[];
    }
  >,
) {
  const seoByPostId = await loadSeoByPostIds(posts.map((post) => post.id));
  return posts.map((post) => mapBlogPostToContent(post, seoByPostId.get(post.id) ?? null));
}

export const prismaBlogRepository: BlogRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const status = toPrismaContentStatus(options?.status);

    const [config, posts, categories, tags] = await Promise.all([
      prisma.blogPageConfig.findUnique({ where: { locale } }),
      prisma.blogPost.findMany({
        where: { locale, status },
        orderBy: { publishedAt: "desc" },
        include: postInclude,
      }),
      prisma.category.findMany({
        where: { type: "BLOG" },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Blog page config", locale);
    }

    const seoByPostId = await loadSeoByPostIds(posts.map((post) => post.id));

    return mapBlogToContent(config, posts, categories, tags, seoByPostId);
  },

  async getPostBySlug(slug, options) {
    const locale = resolveLocale(options);
    const status = toPrismaContentStatus(options?.status);

    const post = await prisma.blogPost.findFirst({
      where: { slug, locale, status },
      include: postInclude,
    });

    if (!post) {
      return null;
    }

    const seo = await prisma.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: "blog_post",
          entityId: post.id,
        },
      },
    });

    return mapBlogPostToContent(post, seo);
  },

  async getPostBySlugAnyStatus(slug, locale = "en") {
    const post = await prisma.blogPost.findFirst({
      where: { slug, locale },
      include: postInclude,
    });

    if (!post) return null;

    const seo = await prisma.seoMetadata.findUnique({
      where: {
        entityType_entityId: {
          entityType: "blog_post",
          entityId: post.id,
        },
      },
    });

    return mapBlogPostToContent(post, seo);
  },

  async listPublishedPosts(filters) {
    const posts = await prisma.blogPost.findMany({
      where: buildPublishedWhere(filters),
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: postInclude,
    });

    return mapPostsWithSeo(posts);
  },

  async getFeaturedPosts(locale = "en", limit = 3) {
    const posts = await prisma.blogPost.findMany({
      where: { locale, status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: postInclude,
    });

    return mapPostsWithSeo(posts);
  },

  async getRelatedPosts(postId, limit = 3) {
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: postInclude,
    });

    if (!post) return [];

    const categoryIds = post.categories.map((item) => item.categoryId);
    const tagIds = post.tags.map((item) => item.tagId);

    const related = await prisma.blogPost.findMany({
      where: {
        id: { not: postId },
        status: "PUBLISHED",
        OR: [
          categoryIds.length
            ? { categories: { some: { categoryId: { in: categoryIds } } } }
            : undefined,
          tagIds.length ? { tags: { some: { tagId: { in: tagIds } } } } : undefined,
        ].filter(Boolean) as Prisma.BlogPostWhereInput[],
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: postInclude,
    });

    return mapPostsWithSeo(related);
  },
};
