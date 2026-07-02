import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, slugify } from "@/repositories/shared/locale";

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
  visible: boolean;
}

export interface ExperiencePageConfigInput {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionVisible: boolean;
  ctaLabel: string;
  ctaHref: string;
  ctaVisible: boolean;
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

export async function getExperiencePageConfig() {
  return prisma.experiencePageConfig.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });
}

export async function updateExperiencePageConfig(input: ExperiencePageConfigInput) {
  return prisma.experiencePageConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      sectionVisible: input.sectionVisible,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      ctaVisible: input.ctaVisible,
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      sectionVisible: input.sectionVisible,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      ctaVisible: input.ctaVisible,
    },
  });
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
      visible: input.visible,
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
      visible: input.visible,
    },
  });

  await syncExperienceTechnologies(id, input.technologies);
  return entry;
}

export async function deleteExperienceEntry(id: string) {
  await prisma.experience.delete({ where: { id } });
}

export async function reorderExperienceEntries(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.experience.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
