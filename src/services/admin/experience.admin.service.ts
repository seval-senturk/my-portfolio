import { prisma } from "@/lib/prisma";
import { slugify } from "@/repositories/shared/locale";

export interface ExperienceEntryInput {
  id?: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  current: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

async function syncExperienceTechnologies(
  experienceId: string,
  technologyNames: string[],
) {
  await prisma.experienceTechnology.deleteMany({ where: { experienceId } });

  for (const name of technologyNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const technology = await prisma.technology.upsert({
      where: { name: trimmed },
      update: { slug: slugify(trimmed) },
      create: { name: trimmed, slug: slugify(trimmed) },
    });

    await prisma.experienceTechnology.create({
      data: { experienceId, technologyId: technology.id },
    });
  }
}

export async function listExperienceEntries() {
  return prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      technologies: { include: { technology: true } },
    },
  });
}

export async function createExperienceEntry(input: ExperienceEntryInput) {
  const count = await prisma.experience.count();
  const id = input.id ?? `exp-${Date.now()}`;

  const entry = await prisma.experience.create({
    data: {
      id,
      company: input.company,
      position: input.position,
      employmentType: input.employmentType,
      location: input.location,
      startMonth: input.startMonth,
      startYear: input.startYear,
      endMonth: input.current ? null : (input.endMonth ?? null),
      endYear: input.current ? null : (input.endYear ?? null),
      current: input.current,
      summary: input.summary,
      responsibilities: input.responsibilities,
      achievements: input.achievements,
      sortOrder: count,
    },
  });

  await syncExperienceTechnologies(entry.id, input.technologies);
  return entry;
}

export async function updateExperienceEntry(id: string, input: ExperienceEntryInput) {
  const entry = await prisma.experience.update({
    where: { id },
    data: {
      company: input.company,
      position: input.position,
      employmentType: input.employmentType,
      location: input.location,
      startMonth: input.startMonth,
      startYear: input.startYear,
      endMonth: input.current ? null : (input.endMonth ?? null),
      endYear: input.current ? null : (input.endYear ?? null),
      current: input.current,
      summary: input.summary,
      responsibilities: input.responsibilities,
      achievements: input.achievements,
    },
  });

  await syncExperienceTechnologies(id, input.technologies);
  return entry;
}

export async function deleteExperienceEntry(id: string) {
  await prisma.experience.delete({ where: { id } });
}
