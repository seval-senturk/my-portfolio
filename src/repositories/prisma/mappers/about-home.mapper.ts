import type { AboutHomeConfig, AboutHomeFeatureCard } from "@prisma/client";

import { aboutHomeContent } from "@/data/about-home.data";
import type {
  AboutHomeContent,
  AboutHomeFeatureCard as FeatureCardType,
  AboutHomeProfile,
} from "@/types/about-home";

function mapProfile(config: AboutHomeConfig): AboutHomeProfile {
  return {
    imageSrc: config.profileImageUrl ?? undefined,
    imageAlt: config.profileImageAlt || aboutHomeContent.profile.imageAlt,
    initials: config.profileInitials || aboutHomeContent.profile.initials,
    visible: config.profileVisible ?? aboutHomeContent.profile.visible,
  };
}

function mapVisibleFeatureCards(cards: AboutHomeFeatureCard[]): FeatureCardType[] {
  return cards
    .filter((card) => card.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((card) => ({
      id: card.id,
      number: card.number,
      icon: card.icon,
      title: card.title,
      description: card.description,
      visible: card.visible,
      sortOrder: card.sortOrder,
    }));
}

export function mapAboutHomeAdminFeatureCards(
  cards: AboutHomeFeatureCard[],
): FeatureCardType[] {
  return [...cards]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((card) => ({
      id: card.id,
      number: card.number,
      icon: card.icon,
      title: card.title,
      description: card.description,
      visible: card.visible,
      sortOrder: card.sortOrder,
    }));
}

function mapAboutHomeCore(
  config: AboutHomeConfig,
  featureCards: AboutHomeFeatureCard[],
): AboutHomeContent {
  return {
    section: {
      visible: config.visible,
      label: config.sectionLabel,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
    },
    profile: mapProfile(config),
    cta: {
      label: config.ctaLabel || aboutHomeContent.cta.label,
      href: config.ctaHref || aboutHomeContent.cta.href,
      visible: config.ctaVisible ?? aboutHomeContent.cta.visible,
    },
    secondaryCta: {
      label: config.secondaryCtaLabel || aboutHomeContent.secondaryCta.label,
      href: config.secondaryCtaHref || aboutHomeContent.secondaryCta.href,
      visible: config.secondaryCtaVisible ?? aboutHomeContent.secondaryCta.visible,
    },
    featureCards: mapVisibleFeatureCards(featureCards),
  };
}

export function mapAboutHomeToContent(
  config: AboutHomeConfig,
  featureCards: AboutHomeFeatureCard[] = [],
): AboutHomeContent {
  return mapAboutHomeCore(config, featureCards);
}

export function mapAboutHomeToAdminContent(
  config: AboutHomeConfig,
  featureCards: AboutHomeFeatureCard[] = [],
): AboutHomeContent {
  return {
    ...mapAboutHomeCore(config, featureCards),
    featureCards: mapAboutHomeAdminFeatureCards(featureCards),
  };
}
