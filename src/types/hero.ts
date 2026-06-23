import type { StatItem } from "@/types/stats";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroTechnologyHighlight {
  category: string;
  technologies: readonly string[];
}

export interface HeroProfile {
  imageSrc?: string;
  imageAlt: string;
  initials: string;
}

/** @deprecated Use StatItem from @/types/stats */
export type HeroStat = StatItem;

export interface HeroContent {
  eyebrow: string;
  headline: string;
  summary: string;
  technologyHighlightsTitle: string;
  technologyHighlights: readonly HeroTechnologyHighlight[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  profile: HeroProfile;
}
