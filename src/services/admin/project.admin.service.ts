import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface ProjectEntryInput {
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  status?: string;
  client?: string;
  role: string;
  featured: boolean;
  coverImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  highlights: string[];
}

async function syncProjectTechnologies(projectId: string, technologyNames: string[]) {
  await prisma.projectTechnology.deleteMany({ where: { projectId } });

  for (const name of technologyNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const technology = await prisma.technology.upsert({
      where: { name: trimmed },
      update: { slug: slugify(trimmed) },
      create: { name: trimmed, slug: slugify(trimmed) },
    });

    await prisma.projectTechnology.create({
      data: { projectId, technologyId: technology.id },
    });
  }
}

export async function listProjectEntries() {
  return prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    include: { technologies: { include: { technology: true } } },
  });
}

export async function createProjectEntry(input: ProjectEntryInput) {
  const count = await prisma.project.count();
  const id = input.id ?? `proj-${Date.now()}`;

  const project = await prisma.project.create({
    data: {
      id,
      slug: input.slug,
      title: input.title,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      category: input.category,
      status: input.status ?? null,
      client: input.client ?? null,
      role: input.role,
      featured: input.featured,
      coverImageUrl: input.coverImageUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      highlights: input.highlights,
      sortOrder: count,
    },
  });

  await syncProjectTechnologies(project.id, input.technologies);
  return project;
}

export async function updateProjectEntry(id: string, input: ProjectEntryInput) {
  const project = await prisma.project.update({
    where: { id },
    data: {
      slug: input.slug,
      title: input.title,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      category: input.category,
      status: input.status ?? null,
      client: input.client ?? null,
      role: input.role,
      featured: input.featured,
      coverImageUrl: input.coverImageUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      liveUrl: input.liveUrl ?? null,
      highlights: input.highlights,
    },
  });

  await syncProjectTechnologies(id, input.technologies);
  return project;
}

export async function deleteProjectEntry(id: string) {
  await prisma.project.delete({ where: { id } });
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseMultilineList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
