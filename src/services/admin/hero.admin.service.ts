import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export interface UpdateHeroInput {
  eyebrow: string;
  headline: string;
  summary: string;
  technologyHighlightsTitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  profileImageUrl?: string;
  profileImageAlt: string;
  profileInitials: string;
}

export async function updateHero(input: UpdateHeroInput) {
  return prisma.hero.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      eyebrow: input.eyebrow,
      headline: input.headline,
      summary: input.summary,
      technologyHighlightsTitle: input.technologyHighlightsTitle,
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
    },
    create: {
      locale: DEFAULT_LOCALE,
      eyebrow: input.eyebrow,
      headline: input.headline,
      summary: input.summary,
      technologyHighlightsTitle: input.technologyHighlightsTitle,
      technologyHighlights: [],
      primaryCtaLabel: input.primaryCtaLabel,
      primaryCtaHref: input.primaryCtaHref,
      secondaryCtaLabel: input.secondaryCtaLabel,
      secondaryCtaHref: input.secondaryCtaHref,
      profileImageUrl: input.profileImageUrl ?? null,
      profileImageAlt: input.profileImageAlt,
      profileInitials: input.profileInitials,
    },
  });
}

export async function getHeroRecord() {
  return prisma.hero.findUnique({ where: { locale: DEFAULT_LOCALE } });
}
