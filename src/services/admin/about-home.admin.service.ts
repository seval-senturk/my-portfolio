import { prisma } from "@/lib/prisma";
import type { AboutHomeConfigInput, AboutHomeFeatureCardInput } from "@/types/about-home";

function hasAboutHomeModels(): boolean {
  return (
    "aboutHomeConfig" in prisma &&
    "aboutHomeFeatureCard" in prisma &&
    typeof prisma.aboutHomeConfig?.findUnique === "function"
  );
}

function requireAboutHomeModels() {
  if (!hasAboutHomeModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }
}

export async function getAboutHomeConfig() {
  if (!hasAboutHomeModels()) {
    return null;
  }

  try {
    return await prisma.aboutHomeConfig.findUnique({ where: { locale: "en" } });
  } catch (error) {
    console.error("[about-home.admin] Failed to load AboutHomeConfig.", error);
    return null;
  }
}

export async function listAboutHomeFeatureCards() {
  if (!hasAboutHomeModels()) {
    return [];
  }

  try {
    return await prisma.aboutHomeFeatureCard.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("[about-home.admin] Failed to load AboutHomeFeatureCards.", error);
    return [];
  }
}

export async function getAboutHomeAdminContent() {
  const [config, featureCards] = await Promise.all([
    getAboutHomeConfig(),
    listAboutHomeFeatureCards(),
  ]);

  return { config, featureCards };
}

export async function updateAboutHomeConfig(input: AboutHomeConfigInput) {
  requireAboutHomeModels();

  return prisma.aboutHomeConfig.upsert({
    where: { locale: "en" },
    update: {
      visible: input.visible,
      sectionLabel: input.sectionLabel,
      title: input.title,
      titleAccent: input.titleAccent,
      description: input.description,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      ctaVisible: input.ctaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
      profileVisible: input.profileVisible,
    },
    create: {
      locale: "en",
      visible: input.visible,
      sectionLabel: input.sectionLabel,
      title: input.title,
      titleAccent: input.titleAccent,
      description: input.description,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      ctaVisible: input.ctaVisible,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      secondaryCtaVisible: input.secondaryCtaVisible,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
      profileVisible: input.profileVisible,
    },
  });
}

export async function createAboutHomeFeatureCard(input: AboutHomeFeatureCardInput) {
  requireAboutHomeModels();

  const count = await prisma.aboutHomeFeatureCard.count();
  const id = input.id ?? `about-fc-${Date.now()}`;

  return prisma.aboutHomeFeatureCard.create({
    data: {
      id,
      number: input.number,
      icon: input.icon,
      title: input.title,
      description: input.description,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateAboutHomeFeatureCard(
  id: string,
  input: AboutHomeFeatureCardInput,
) {
  requireAboutHomeModels();

  return prisma.aboutHomeFeatureCard.update({
    where: { id },
    data: {
      number: input.number,
      icon: input.icon,
      title: input.title,
      description: input.description,
      visible: input.visible,
    },
  });
}

export async function deleteAboutHomeFeatureCard(id: string) {
  requireAboutHomeModels();
  await prisma.aboutHomeFeatureCard.delete({ where: { id } });
}

export async function reorderAboutHomeFeatureCards(orderedIds: string[]) {
  requireAboutHomeModels();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.aboutHomeFeatureCard.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
