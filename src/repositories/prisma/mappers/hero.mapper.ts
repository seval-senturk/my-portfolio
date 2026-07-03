import type { Hero, HeroStat, HeroTechnologyCard } from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import type { HeroContent, HeroTechnologyHighlight } from "@/types/hero";

type HeroWithRelations = Hero & {
  technologyCards?: HeroTechnologyCard[];
  stats?: HeroStat[];
};

export function mapHeroTechnologyCards(
  cards: HeroTechnologyCard[],
): HeroContent["technologyCards"] {
  return cards
    .filter((card) => card.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((card) => ({
      id: card.id,
      icon: card.icon,
      title: card.title,
      href: card.href ?? undefined,
      position: card.position,
      sortOrder: card.sortOrder,
      visible: card.visible,
    }));
}

export function mapHeroStats(stats: HeroStat[]): HeroContent["stats"] {
  return stats
    .filter((stat) => stat.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((stat) => ({
      id: stat.id,
      icon: stat.icon,
      value: stat.value,
      label: stat.label,
      sortOrder: stat.sortOrder,
      visible: stat.visible,
    }));
}

export function mapHeroToContent(
  hero: HeroWithRelations,
  technologyCards: HeroTechnologyCard[] = hero.technologyCards ?? [],
  stats: HeroStat[] = hero.stats ?? [],
): HeroContent {
  const technologyHighlights = fromJson<HeroTechnologyHighlight[]>(
    hero.technologyHighlights,
  );

  return {
    eyebrow: hero.eyebrow,
    headline: hero.headline,
    jobTitle: hero.jobTitle,
    summary: hero.summary,
    technologyHighlightsTitle: hero.technologyHighlightsTitle,
    technologyHighlights,
    primaryCta: {
      label: hero.primaryCtaLabel,
      href: hero.primaryCtaHref,
      visible: hero.primaryCtaVisible,
    },
    secondaryCta: {
      label: hero.secondaryCtaLabel,
      href: hero.secondaryCtaHref,
      visible: hero.secondaryCtaVisible,
    },
    profile: {
      imageSrc: hero.profileImageUrl ?? undefined,
      imageAlt: hero.profileImageAlt,
      initials: hero.profileInitials,
      visible: hero.profileVisible,
    },
    orbitalLinesEnabled: hero.orbitalLinesEnabled,
    statsEnabled: hero.statsEnabled,
    technologyCards: mapHeroTechnologyCards(technologyCards),
    stats: mapHeroStats(stats),
  };
}

export function mapHeroToAdminContent(
  hero: Hero,
  technologyCards: HeroTechnologyCard[],
  stats: HeroStat[],
): HeroContent {
  const technologyHighlights = fromJson<HeroTechnologyHighlight[]>(
    hero.technologyHighlights,
  );

  return {
    eyebrow: hero.eyebrow,
    headline: hero.headline,
    jobTitle: hero.jobTitle,
    summary: hero.summary,
    technologyHighlightsTitle: hero.technologyHighlightsTitle,
    technologyHighlights,
    primaryCta: {
      label: hero.primaryCtaLabel,
      href: hero.primaryCtaHref,
      visible: hero.primaryCtaVisible,
    },
    secondaryCta: {
      label: hero.secondaryCtaLabel,
      href: hero.secondaryCtaHref,
      visible: hero.secondaryCtaVisible,
    },
    profile: {
      imageSrc: hero.profileImageUrl ?? undefined,
      imageAlt: hero.profileImageAlt,
      initials: hero.profileInitials,
      visible: hero.profileVisible,
    },
    orbitalLinesEnabled: hero.orbitalLinesEnabled,
    statsEnabled: hero.statsEnabled,
    technologyCards: [...technologyCards]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((card) => ({
        id: card.id,
        icon: card.icon,
        title: card.title,
        href: card.href ?? undefined,
        position: card.position,
        sortOrder: card.sortOrder,
        visible: card.visible,
      })),
    stats: [...stats]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((stat) => ({
        id: stat.id,
        icon: stat.icon,
        value: stat.value,
        label: stat.label,
        sortOrder: stat.sortOrder,
        visible: stat.visible,
      })),
  };
}
