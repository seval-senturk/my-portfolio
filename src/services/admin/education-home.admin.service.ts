import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export interface EducationHomeConfigInput {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  sectionVisible: boolean;
}

export interface EducationHomeEntryInput {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  levelBadge: string;
  startMonth?: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  description: string;
  technologies: string[];
  visible: boolean;
}

export async function getEducationHomeConfig() {
  return prisma.educationHomeConfig.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });
}

export async function updateEducationHomeConfig(input: EducationHomeConfigInput) {
  return prisma.educationHomeConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription || null,
      sectionVisible: input.sectionVisible,
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription || null,
      sectionVisible: input.sectionVisible,
    },
  });
}

export async function listEducationHomeEntries() {
  return prisma.educationHomeEntry.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createEducationHomeEntry(input: EducationHomeEntryInput) {
  const count = await prisma.educationHomeEntry.count();
  const id = input.id ?? `edu-home-${Date.now()}`;

  return prisma.educationHomeEntry.create({
    data: {
      id,
      institution: input.institution,
      degree: input.degree,
      fieldOfStudy: input.fieldOfStudy || null,
      levelBadge: input.levelBadge || null,
      startMonth: input.startMonth ?? null,
      startYear: input.startYear,
      endMonth: input.endMonth ?? null,
      endYear: input.endYear ?? null,
      description: input.description,
      technologies: input.technologies,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateEducationHomeEntry(
  id: string,
  input: EducationHomeEntryInput,
) {
  return prisma.educationHomeEntry.update({
    where: { id },
    data: {
      institution: input.institution,
      degree: input.degree,
      fieldOfStudy: input.fieldOfStudy || null,
      levelBadge: input.levelBadge || null,
      startMonth: input.startMonth ?? null,
      startYear: input.startYear,
      endMonth: input.endMonth ?? null,
      endYear: input.endYear ?? null,
      description: input.description,
      technologies: input.technologies,
      visible: input.visible,
    },
  });
}

export async function deleteEducationHomeEntry(id: string) {
  await prisma.educationHomeEntry.delete({ where: { id } });
}

export async function reorderEducationHomeEntries(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.educationHomeEntry.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
