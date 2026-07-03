import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type {
  HeroStatInput,
  HeroTechnologyCardInput,
  UpdateHeroInput,
} from "@/types/hero";

function hasHeroExtendedModels(): boolean {
  return (
    "heroTechnologyCard" in prisma &&
    "heroStat" in prisma &&
    typeof prisma.heroTechnologyCard?.findMany === "function"
  );
}

export async function updateHero(input: UpdateHeroInput) {
  return prisma.hero.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      eyebrow: input.eyebrow,
      headline: input.headline,
      jobTitle: input.jobTitle,
      summary: input.summary,
      technologyHighlightsTitle: input.technologyHighlightsTitle,
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      primaryCtaVisible: input.primaryCtaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
      profileVisible: input.profileVisible,
      orbitalLinesEnabled: input.orbitalLinesEnabled,
      statsEnabled: input.statsEnabled,
    },
    create: {
      locale: DEFAULT_LOCALE,
      eyebrow: input.eyebrow,
      headline: input.headline,
      jobTitle: input.jobTitle,
      summary: input.summary,
      technologyHighlightsTitle: input.technologyHighlightsTitle,
      technologyHighlights: [],
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      primaryCtaVisible: input.primaryCtaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
      profileVisible: input.profileVisible,
      orbitalLinesEnabled: input.orbitalLinesEnabled,
      statsEnabled: input.statsEnabled,
    },
  });
}

export async function getHeroRecord() {
  return prisma.hero.findUnique({ where: { locale: DEFAULT_LOCALE } });
}

export async function getHeroTechnologyCard(id: string) {
  if (!hasHeroExtendedModels()) {
    return null;
  }

  return prisma.heroTechnologyCard.findUnique({ where: { id } });
}

export async function listHeroTechnologyCards() {
  if (!hasHeroExtendedModels()) {
    return [];
  }

  return prisma.heroTechnologyCard.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function listHeroStats() {
  if (!hasHeroExtendedModels()) {
    return [];
  }

  return prisma.heroStat.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createHeroTechnologyCard(input: HeroTechnologyCardInput) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.heroTechnologyCard.count();
  const id = input.id ?? `hero-tech-${Date.now()}`;

  return prisma.heroTechnologyCard.create({
    data: {
      id,
      icon: input.icon,
      title: input.title,
      href: input.href ?? null,
      position: input.position,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateHeroTechnologyCard(
  id: string,
  input: HeroTechnologyCardInput,
) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.heroTechnologyCard.update({
    where: { id },
    data: {
      icon: input.icon,
      title: input.title,
      href: input.href ?? null,
      position: input.position,
      visible: input.visible,
    },
  });
}

export async function deleteHeroTechnologyCard(id: string) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.heroTechnologyCard.delete({ where: { id } });
}

export async function reorderHeroTechnologyCards(orderedIds: string[]) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroTechnologyCard.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export async function createHeroStat(input: HeroStatInput) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.heroStat.count();
  const id = input.id ?? `hero-stat-${Date.now()}`;

  return prisma.heroStat.create({
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

export async function updateHeroStat(id: string, input: HeroStatInput) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.heroStat.update({
    where: { id },
    data: {
      icon: input.icon,
      value: input.value,
      label: input.label,
      visible: input.visible,
    },
  });
}

export async function deleteHeroStat(id: string) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.heroStat.delete({ where: { id } });
}

export async function reorderHeroStats(orderedIds: string[]) {
  if (!hasHeroExtendedModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroStat.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export async function getHeroAdminContent() {
  const hero = await getHeroRecord();
  const [technologyCards, stats] = await Promise.all([
    listHeroTechnologyCards(),
    listHeroStats(),
  ]);

  return { hero, technologyCards, stats };
}
