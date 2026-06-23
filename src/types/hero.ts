export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroStat {
  label: string;
  value: string;
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

export interface HeroContent {
  eyebrow: string;
  headline: string;
  summary: string;
  technologyHighlights: readonly HeroTechnologyHighlight[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  socialProof: readonly HeroStat[];
  profile: HeroProfile;
}
