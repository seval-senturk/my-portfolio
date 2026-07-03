import type { StatItem } from "@/types/stats";

export interface HeroCta {
  label: string;
  href: string;
  visible: boolean;
}

export interface HeroTechnologyHighlight {
  category: string;
  technologies: readonly string[];
}

export interface HeroProfile {
  imageSrc?: string;
  imageAlt: string;
  initials: string;
  visible: boolean;
}

export interface HeroTechnologyCard {
  id: string;
  icon: string;
  title: string;
  href?: string;
  position: number;
  sortOrder: number;
  visible: boolean;
}

export interface HeroStatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  sortOrder: number;
  visible: boolean;
}

/** @deprecated Use StatItem from @/types/stats */
export type HeroStat = StatItem;

export interface HeroContent {
  eyebrow: string;
  headline: string;
  jobTitle: string;
  summary: string;
  technologyHighlightsTitle: string;
  technologyHighlights: readonly HeroTechnologyHighlight[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  profile: HeroProfile;
  orbitalLinesEnabled: boolean;
  statsEnabled: boolean;
  technologyCards: readonly HeroTechnologyCard[];
  stats: readonly HeroStatItem[];
}

export interface HeroTechnologyCardInput {
  id?: string;
  icon: string;
  title: string;
  href?: string;
  position: number;
  visible: boolean;
}

export interface HeroStatInput {
  id?: string;
  icon: string;
  value: string;
  label: string;
  visible: boolean;
}

export interface UpdateHeroInput {
  eyebrow: string;
  headline: string;
  jobTitle: string;
  summary: string;
  technologyHighlightsTitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  primaryCtaVisible: boolean;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaVisible: boolean;
  profileImageUrl?: string;
  profileImageAlt: string;
  profileInitials: string;
  profileVisible: boolean;
  orbitalLinesEnabled: boolean;
  statsEnabled: boolean;
}
