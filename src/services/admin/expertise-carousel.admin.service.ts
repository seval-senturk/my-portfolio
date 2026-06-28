import { prisma } from "@/lib/prisma";
import type {
  ExpertiseCarouselConfigInput,
  ExpertiseCarouselItemInput,
} from "@/types/expertise-carousel";

function hasExpertiseCarouselModels(): boolean {
  return (
    "expertiseCarouselConfig" in prisma &&
    "expertiseCarouselItem" in prisma &&
    typeof prisma.expertiseCarouselConfig?.findUnique === "function"
  );
}

export function parseExpertiseBulletList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function getExpertiseCarouselConfig() {
  if (!hasExpertiseCarouselModels()) {
    return null;
  }

  return prisma.expertiseCarouselConfig.findUnique({
    where: { locale: "en" },
  });
}

export async function listExpertiseCarouselItems() {
  if (!hasExpertiseCarouselModels()) {
    return [];
  }

  return prisma.expertiseCarouselItem.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateExpertiseCarouselConfig(
  input: ExpertiseCarouselConfigInput,
) {
  if (!hasExpertiseCarouselModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }
  return prisma.expertiseCarouselConfig.upsert({
    where: { locale: "en" },
    update: {
      label: input.label,
      title: input.title,
      description: input.description,
      visible: input.visible,
    },
    create: {
      locale: "en",
      label: input.label,
      title: input.title,
      description: input.description,
      visible: input.visible,
    },
  });
}

export async function createExpertiseCarouselItem(
  input: ExpertiseCarouselItemInput,
) {
  if (!hasExpertiseCarouselModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.expertiseCarouselItem.count();
  const id = input.id ?? `expertise-${Date.now()}`;

  return prisma.expertiseCarouselItem.create({
    data: {
      id,
      icon: input.icon,
      title: input.title,
      description: input.description ?? null,
      bulletItems: input.bulletItems,
      ctaLabel: input.ctaLabel ?? null,
      ctaHref: input.ctaHref ?? null,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateExpertiseCarouselItem(
  id: string,
  input: ExpertiseCarouselItemInput,
) {
  if (!hasExpertiseCarouselModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.expertiseCarouselItem.update({
    where: { id },
    data: {
      icon: input.icon,
      title: input.title,
      description: input.description ?? null,
      bulletItems: input.bulletItems,
      ctaLabel: input.ctaLabel ?? null,
      ctaHref: input.ctaHref ?? null,
      visible: input.visible,
    },
  });
}

export async function deleteExpertiseCarouselItem(id: string) {
  if (!hasExpertiseCarouselModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.expertiseCarouselItem.delete({ where: { id } });
}

export async function reorderExpertiseCarouselItems(orderedIds: string[]) {
  if (!hasExpertiseCarouselModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.expertiseCarouselItem.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
