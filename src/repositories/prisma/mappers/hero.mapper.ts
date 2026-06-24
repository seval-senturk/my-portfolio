import type { Hero } from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import type { HeroContent, HeroTechnologyHighlight } from "@/types/hero";

export function mapHeroToContent(hero: Hero): HeroContent {
  const technologyHighlights = fromJson<HeroTechnologyHighlight[]>(
    hero.technologyHighlights,
  );

  return {
    eyebrow: hero.eyebrow,
    headline: hero.headline,
    summary: hero.summary,
    technologyHighlightsTitle: hero.technologyHighlightsTitle,
    technologyHighlights,
    primaryCta: {
      label: hero.primaryCtaLabel,
      href: hero.primaryCtaHref,
    },
    secondaryCta: {
      label: hero.secondaryCtaLabel,
      href: hero.secondaryCtaHref,
    },
    profile: {
      imageSrc: hero.profileImageUrl ?? undefined,
      imageAlt: hero.profileImageAlt,
      initials: hero.profileInitials,
    },
  };
}
