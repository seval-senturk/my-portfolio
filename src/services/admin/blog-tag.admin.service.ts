import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface BlogTagInput {
  id?: string;
  name: string;
  slug?: string;
}

async function isTagSlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (!existing) return false;
  return existing.id !== excludeId;
}

async function resolveTagSlug(name: string, requested?: string, excludeId?: string) {
  const base = slugify(requested?.trim() || name) || "tag";
  let candidate = base;
  let counter = 1;

  while (await isTagSlugTaken(candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export async function listBlogTagsAdmin() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createBlogTag(input: BlogTagInput) {
  const slug = await resolveTagSlug(input.name, input.slug);

  return prisma.tag.create({
    data: {
      name: input.name.trim(),
      slug,
    },
  });
}

export async function updateBlogTag(id: string, input: BlogTagInput) {
  const slug = await resolveTagSlug(input.name, input.slug, id);

  return prisma.tag.update({
    where: { id },
    data: {
      name: input.name.trim(),
      slug,
    },
  });
}

export async function deleteBlogTag(id: string) {
  await prisma.tag.delete({ where: { id } });
}
