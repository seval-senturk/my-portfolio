import type { Prisma } from "@prisma/client";

import { siteConfig } from "@/config/site.config";
import {
  blogJsonToHtml,
  calculateReadingTimeMinutes,
  extractPlainTextFromHtml,
  generateSlugFromTitle,
} from "@/lib/blog";
import { resolveSanitizedBlogHtml } from "@/lib/blog/resolve-content-html";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface BlogSeoInput {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  seoNotes?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  ogType?: string;
  twitterImageUrl?: string;
  twitterCardType?: "SUMMARY" | "SUMMARY_LARGE_IMAGE";
  keywords?: string[];
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
}

export interface BlogPostInput {
  id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  contentHtml: string;
  contentJson?: Record<string, unknown>;
  authorName?: string;
  status: "draft" | "published" | "scheduled" | "archived";
  featured: boolean;
  coverImageUrl?: string;
  coverImageAlt?: string;
  categoryIds: string[];
  tagIds: string[];
  scheduledAt?: string;
  seo?: BlogSeoInput;
  locale?: string;
}

const postInclude = {
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
} as const;

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
}

async function resolveUniqueSlug(
  title: string,
  requestedSlug: string | undefined,
  excludeId?: string,
): Promise<string> {
  const base = slugify(requestedSlug?.trim() || generateSlugFromTitle(title)) || "post";
  let candidate = base;
  let counter = 1;

  while (await isSlugTaken(candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function syncCategories(postId: string, categoryIds: string[]) {
  await prisma.blogPostCategory.deleteMany({ where: { blogPostId: postId } });
  for (const categoryId of categoryIds) {
    await prisma.blogPostCategory.create({ data: { blogPostId: postId, categoryId } });
  }
}

async function syncTags(postId: string, tagIds: string[]) {
  await prisma.blogPostTag.deleteMany({ where: { blogPostId: postId } });
  for (const tagId of tagIds) {
    await prisma.blogPostTag.create({ data: { blogPostId: postId, tagId } });
  }
}

async function upsertSeo(postId: string, seo?: BlogSeoInput) {
  if (!seo) return;

  await prisma.seoMetadata.upsert({
    where: {
      entityType_entityId: {
        entityType: "blog_post",
        entityId: postId,
      },
    },
    update: {
      metaTitle: seo.metaTitle ?? null,
      metaDescription: seo.metaDescription ?? null,
      canonicalUrl: seo.canonicalUrl ?? null,
      focusKeyword: seo.focusKeyword ?? null,
      seoNotes: seo.seoNotes ?? null,
      ogImageUrl: seo.ogImageUrl ?? null,
      ogImageAlt: seo.ogImageAlt ?? null,
      ogType: seo.ogType ?? "article",
      twitterImageUrl: seo.twitterImageUrl ?? null,
      twitterCardType: seo.twitterCardType ?? null,
      keywords: seo.keywords ?? [],
      robotsIndex: seo.robotsIndex ?? null,
      robotsFollow: seo.robotsFollow ?? null,
    },
    create: {
      entityType: "blog_post",
      entityId: postId,
      metaTitle: seo.metaTitle ?? null,
      metaDescription: seo.metaDescription ?? null,
      canonicalUrl: seo.canonicalUrl ?? null,
      focusKeyword: seo.focusKeyword ?? null,
      seoNotes: seo.seoNotes ?? null,
      ogImageUrl: seo.ogImageUrl ?? null,
      ogImageAlt: seo.ogImageAlt ?? null,
      ogType: seo.ogType ?? "article",
      twitterImageUrl: seo.twitterImageUrl ?? null,
      twitterCardType: seo.twitterCardType ?? null,
      keywords: seo.keywords ?? [],
      robotsIndex: seo.robotsIndex ?? null,
      robotsFollow: seo.robotsFollow ?? null,
    },
  });
}

function resolvePublishDates(input: BlogPostInput) {
  const scheduledAt =
    input.status === "scheduled" && input.scheduledAt
      ? new Date(input.scheduledAt)
      : null;

  const publishedAt =
    input.status === "published"
      ? new Date()
      : input.status === "scheduled"
        ? scheduledAt
        : null;

  return { scheduledAt, publishedAt };
}

function buildPostPayload(input: BlogPostInput, slug: string) {
  const contentHtml = resolveSanitizedBlogHtml({
    contentHtml: input.contentHtml,
    contentJson: input.contentJson,
  });
  const contentJson = input.contentJson
    ? (input.contentJson as Prisma.InputJsonValue)
    : undefined;
  const searchText = extractPlainTextFromHtml(contentHtml);
  const readingTimeMinutes = calculateReadingTimeMinutes(searchText);
  const { scheduledAt, publishedAt } = resolvePublishDates(input);

  return {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: contentHtml,
    contentJson,
    authorName: input.authorName?.trim() || siteConfig.author.name,
    readingTimeMinutes,
    featured: input.featured,
    coverImageUrl: input.coverImageUrl?.trim() || null,
    coverImageAlt: input.coverImageAlt?.trim() || null,
    searchText,
    locale: input.locale?.trim() || "en",
    status: input.status.toUpperCase() as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
    scheduledAt,
    publishedAt,
  };
}

/** Revision history hook — implement BlogRevision table in a future phase. */
export function createRevisionSnapshot() {
  return null;
}

export async function listBlogPostsAdmin() {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: postInclude,
  });
}

export async function getBlogPostAdmin(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: postInclude,
  });
}

export async function createBlogPost(input: BlogPostInput) {
  const slug = await resolveUniqueSlug(input.title, input.slug);
  const data = buildPostPayload(input, slug);

  const post = await prisma.blogPost.create({ data });
  await syncCategories(post.id, input.categoryIds);
  await syncTags(post.id, input.tagIds);
  await upsertSeo(post.id, input.seo);

  return prisma.blogPost.findUniqueOrThrow({
    where: { id: post.id },
    include: postInclude,
  });
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const slug = await resolveUniqueSlug(input.title, input.slug, id);
  const data = buildPostPayload(input, slug);

  await prisma.blogPost.update({ where: { id }, data });
  await syncCategories(id, input.categoryIds);
  await syncTags(id, input.tagIds);
  await upsertSeo(id, input.seo);

  return prisma.blogPost.findUniqueOrThrow({
    where: { id },
    include: postInclude,
  });
}

export async function deleteBlogPost(id: string) {
  await prisma.seoMetadata.deleteMany({
    where: { entityType: "blog_post", entityId: id },
  });
  await prisma.blogPost.delete({ where: { id } });
}

export async function autosaveBlogPostDraft(id: string, input: Partial<BlogPostInput>) {
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return null;

  let contentHtml: string;

  try {
    contentHtml = resolveSanitizedBlogHtml({
      contentHtml: input.contentHtml ?? existing.content,
      contentJson:
        input.contentJson ??
        (existing.contentJson && typeof existing.contentJson === "object"
          ? (existing.contentJson as Record<string, unknown>)
          : undefined),
    });
  } catch {
    contentHtml = existing.content;
  }
  const contentJson = input.contentJson
    ? (input.contentJson as Prisma.InputJsonValue)
    : existing.contentJson
      ? (existing.contentJson as Prisma.InputJsonValue)
      : undefined;
  const searchText = extractPlainTextFromHtml(contentHtml);

  return prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title?.trim() ?? existing.title,
      excerpt: input.excerpt?.trim() ?? existing.excerpt,
      content: contentHtml,
      contentJson,
      searchText,
      readingTimeMinutes: calculateReadingTimeMinutes(searchText),
      status: "DRAFT",
    },
  });
}

export function serializeBlogPostForForm(
  post: NonNullable<Awaited<ReturnType<typeof getBlogPostAdmin>>>,
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    focusKeyword?: string | null;
    seoNotes?: string | null;
    ogImageUrl?: string | null;
    ogImageAlt?: string | null;
    ogType?: string | null;
    twitterImageUrl?: string | null;
    twitterCardType?: "SUMMARY" | "SUMMARY_LARGE_IMAGE" | null;
    keywords?: string[];
  } | null,
) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    contentHtml: post.content,
    contentJson: (post.contentJson as Record<string, unknown> | null) ?? undefined,
    authorName: post.authorName ?? siteConfig.author.name,
    status: post.status.toLowerCase() as BlogPostInput["status"],
    featured: post.featured,
    coverImageUrl: post.coverImageUrl ?? "",
    coverImageAlt: post.coverImageAlt ?? "",
    categoryIds: post.categories.map((item) => item.categoryId),
    tagIds: post.tags.map((item) => item.tagId),
    scheduledAt: post.scheduledAt?.toISOString() ?? "",
    seo: {
      metaTitle: seo?.metaTitle ?? "",
      metaDescription: seo?.metaDescription ?? "",
      canonicalUrl: seo?.canonicalUrl ?? "",
      focusKeyword: seo?.focusKeyword ?? "",
      seoNotes: seo?.seoNotes ?? "",
      ogImageUrl: seo?.ogImageUrl ?? "",
      ogImageAlt: seo?.ogImageAlt ?? "",
      ogType: seo?.ogType ?? "article",
      twitterImageUrl: seo?.twitterImageUrl ?? "",
      twitterCardType: seo?.twitterCardType ?? "SUMMARY_LARGE_IMAGE",
      keywords: seo?.keywords?.join(", ") ?? "",
    },
  };
}

export { blogJsonToHtml };
