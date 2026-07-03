import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { BlogHomeConfigInput } from "@/types/blog-home";

function hasBlogHomeModels(): boolean {
  return (
    "blogHomeSectionConfig" in prisma &&
    typeof prisma.blogHomeSectionConfig?.findUnique === "function"
  );
}

export async function getBlogHomeConfig() {
  if (!hasBlogHomeModels()) {
    return null;
  }

  return prisma.blogHomeSectionConfig.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });
}

export async function updateBlogHomeConfig(input: BlogHomeConfigInput) {
  if (!hasBlogHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.blogHomeSectionConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      label: input.label,
      title: input.title,
      titleAccent: input.titleAccent || null,
      description: input.description,
      sectionNumber: input.sectionNumber,
      visible: input.visible,
      carouselEnabled: input.carouselEnabled,
      autoplay: input.autoplay,
      autoplayDelayMs: input.autoplayDelayMs,
      loop: input.loop,
      postLimit: input.postLimit,
      selectionMode: input.selectionMode,
      readMoreLabel: input.readMoreLabel,
      ctaLabel: input.ctaLabel || null,
      ctaHref: input.ctaHref || null,
    },
    create: {
      locale: DEFAULT_LOCALE,
      label: input.label,
      title: input.title,
      titleAccent: input.titleAccent || null,
      description: input.description,
      sectionNumber: input.sectionNumber,
      visible: input.visible,
      carouselEnabled: input.carouselEnabled,
      autoplay: input.autoplay,
      autoplayDelayMs: input.autoplayDelayMs,
      loop: input.loop,
      postLimit: input.postLimit,
      selectionMode: input.selectionMode,
      readMoreLabel: input.readMoreLabel,
      ctaLabel: input.ctaLabel || null,
      ctaHref: input.ctaHref || null,
    },
  });
}

export async function listBlogHomeCuratedPosts() {
  if (!hasBlogHomeModels()) {
    return [];
  }

  return prisma.blogHomeCuratedPost.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      blogPost: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
        },
      },
    },
  });
}

export async function listPublishedBlogPostsForPicker() {
  return prisma.blogPost.findMany({
    where: { locale: DEFAULT_LOCALE, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },
  });
}

export async function addBlogHomeCuratedPost(blogPostId: string) {
  if (!hasBlogHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const existing = await prisma.blogHomeCuratedPost.findUnique({
    where: { blogPostId },
  });

  if (existing) {
    return existing;
  }

  const count = await prisma.blogHomeCuratedPost.count();

  return prisma.blogHomeCuratedPost.create({
    data: {
      blogPostId,
      sortOrder: count,
    },
  });
}

export async function removeBlogHomeCuratedPost(id: string) {
  if (!hasBlogHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.blogHomeCuratedPost.delete({ where: { id } });
}

export async function reorderBlogHomeCuratedPosts(orderedIds: string[]) {
  if (!hasBlogHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.blogHomeCuratedPost.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
