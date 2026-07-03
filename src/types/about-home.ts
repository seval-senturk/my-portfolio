import type { HomeCmsSection } from "@/types/section-header";

export interface AboutHomeFeatureCard {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  visible: boolean;
  sortOrder: number;
}

export interface AboutHomeContent {
  section: HomeCmsSection;
  cta: {
    label: string;
    href: string;
    visible: boolean;
  };
  featureCards: readonly AboutHomeFeatureCard[];
}

export interface AboutHomeConfigInput {
  visible: boolean;
  sectionLabel: string;
  title: string;
  titleAccent: string | null;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVisible: boolean;
}

export interface AboutHomeFeatureCardInput {
  id?: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  visible: boolean;
}
