import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface SkillEntryInput {
  id?: string;
  name: string;
  category: string;
  description?: string;
  featured: boolean;
  yearsOfExperience?: number;
  proficiencyLevel?: string;
}

export async function listSkillEntries() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

export async function createSkillEntry(input: SkillEntryInput) {
  const count = await prisma.skill.count();
  const id = input.id ?? `skill-${Date.now()}`;

  const technology = await prisma.technology.upsert({
    where: { name: input.name },
    update: { slug: slugify(input.name) },
    create: { name: input.name, slug: slugify(input.name) },
  });

  return prisma.skill.create({
    data: {
      id,
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      featured: input.featured,
      yearsOfExperience: input.yearsOfExperience ?? null,
      proficiencyLevel: input.proficiencyLevel ?? null,
      technologyId: technology.id,
      sortOrder: count,
    },
  });
}

export async function updateSkillEntry(id: string, input: SkillEntryInput) {
  const technology = await prisma.technology.upsert({
    where: { name: input.name },
    update: { slug: slugify(input.name) },
    create: { name: input.name, slug: slugify(input.name) },
  });

  return prisma.skill.update({
    where: { id },
    data: {
      name: input.name,
      category: input.category,
      description: input.description ?? null,
      featured: input.featured,
      yearsOfExperience: input.yearsOfExperience ?? null,
      proficiencyLevel: input.proficiencyLevel ?? null,
      technologyId: technology.id,
    },
  });
}

export async function deleteSkillEntry(id: string) {
  await prisma.skill.delete({ where: { id } });
}
