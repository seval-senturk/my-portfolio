import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface BlogCategoryInput {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
}

async function isCategorySlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
}

async function resolveCategorySlug(name: string, requested?: string, excludeId?: string) {
  const base = slugify(requested?.trim() || name) || "category";
  let candidate = base;
  let counter = 1;

  while (await isCategorySlugTaken(candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export async function listBlogCategoriesAdmin() {
  return prisma.category.findMany({
    where: { type: "BLOG" },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createBlogCategory(input: BlogCategoryInput) {
  const slug = await resolveCategorySlug(input.name, input.slug);

  return prisma.category.create({
    data: {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      type: "BLOG",
    },
  });
}

export async function updateBlogCategory(id: string, input: BlogCategoryInput) {
  const slug = await resolveCategorySlug(input.name, input.slug, id);

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
    },
  });
}

export async function deleteBlogCategory(id: string) {
  await prisma.category.delete({ where: { id, type: "BLOG" } });
}
