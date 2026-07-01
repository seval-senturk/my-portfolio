import { prisma } from "@/lib/prisma";
import type {
  AboutHomeConfigInput,
  AboutHomeQuickInfoInput,
  AboutHomeStatInput,
} from "@/types/about-home";

function hasAboutHomeModels(): boolean {
  return (
    "aboutHomeConfig" in prisma &&
    "aboutHomeQuickInfo" in prisma &&
    "aboutHomeStat" in prisma &&
    typeof prisma.aboutHomeConfig?.findUnique === "function"
  );
}

export async function getAboutHomeConfig() {
  if (!hasAboutHomeModels()) {
    return null;
  }

  return prisma.aboutHomeConfig.findUnique({ where: { locale: "en" } });
}

export async function listAboutHomeQuickInfo() {
  if (!hasAboutHomeModels()) {
    return [];
  }

  return prisma.aboutHomeQuickInfo.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function listAboutHomeStats() {
  if (!hasAboutHomeModels()) {
    return [];
  }

  return prisma.aboutHomeStat.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function updateAboutHomeConfig(input: AboutHomeConfigInput) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.aboutHomeConfig.upsert({
    where: { locale: "en" },
    update: {
      visible: input.visible,
      sectionLabel: input.sectionLabel,
      title: input.title,
      titleAccent: input.titleAccent,
      description: input.description,
      profileImageUrl: input.profileImageUrl,
      profileImageAlt: input.profileImageAlt,
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      primaryCtaVisible: input.primaryCtaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
    },
    create: {
      locale: "en",
      visible: input.visible,
      sectionLabel: input.sectionLabel,
      title: input.title,
      titleAccent: input.titleAccent,
      description: input.description,
      profileImageUrl: input.profileImageUrl,
      profileImageAlt: input.profileImageAlt,
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      primaryCtaVisible: input.primaryCtaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
    },
  });
}

export async function createAboutHomeQuickInfo(input: AboutHomeQuickInfoInput) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.aboutHomeQuickInfo.count();
  const id = input.id ?? `about-qi-${Date.now()}`;

  return prisma.aboutHomeQuickInfo.create({
    data: {
      id,
      icon: input.icon,
      label: input.label,
      value: input.value,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateAboutHomeQuickInfo(
  id: string,
  input: AboutHomeQuickInfoInput,
) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.aboutHomeQuickInfo.update({
    where: { id },
    data: {
      icon: input.icon,
      label: input.label,
      value: input.value,
      visible: input.visible,
    },
  });
}

export async function deleteAboutHomeQuickInfo(id: string) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.aboutHomeQuickInfo.delete({ where: { id } });
}

export async function reorderAboutHomeQuickInfo(orderedIds: string[]) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.aboutHomeQuickInfo.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export async function createAboutHomeStat(input: AboutHomeStatInput) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.aboutHomeStat.count();
  const id = input.id ?? `about-stat-${Date.now()}`;

  return prisma.aboutHomeStat.create({
    data: {
      id,
      icon: input.icon,
      value: input.value,
      label: input.label,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateAboutHomeStat(id: string, input: AboutHomeStatInput) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.aboutHomeStat.update({
    where: { id },
    data: {
      icon: input.icon,
      value: input.value,
      label: input.label,
      visible: input.visible,
    },
  });
}

export async function deleteAboutHomeStat(id: string) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.aboutHomeStat.delete({ where: { id } });
}

export async function reorderAboutHomeStats(orderedIds: string[]) {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.aboutHomeStat.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
