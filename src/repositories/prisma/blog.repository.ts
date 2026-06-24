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
};
