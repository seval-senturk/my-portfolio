import type { HomeCmsSection } from "@/types/section-header";

export interface AboutHomeProfile {
  imageSrc?: string;
  imageAlt: string;
  initials: string;
  visible: boolean;
}

export interface AboutHomeCta {
  label: string;
  href: string;
  visible: boolean;
}

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
  profile: AboutHomeProfile;
  cta: AboutHomeCta;
  secondaryCta: AboutHomeCta;
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
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaVisible: boolean;
  profileImageUrl?: string;
  profileImageAlt: string;
  profileInitials: string;
  profileVisible: boolean;
}

export interface AboutHomeFeatureCardInput {
  id?: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  visible: boolean;
}
