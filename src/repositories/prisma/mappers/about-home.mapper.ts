import type { AboutHomeConfig, AboutHomeFeatureCard } from "@prisma/client";

import type { AboutHomeContent, AboutHomeFeatureCard as FeatureCardType } from "@/types/about-home";

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

export function mapAboutHomeToContent(
  config: AboutHomeConfig,
  featureCards: AboutHomeFeatureCard[] = [],
): AboutHomeContent {
  return {
    section: {
      visible: config.visible,
      label: config.sectionLabel,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
    },
    cta: {
      label: config.ctaLabel,
      href: config.ctaHref,
      visible: config.ctaVisible,
    },
    featureCards: mapVisibleFeatureCards(featureCards),
  };
}

export function mapAboutHomeToAdminContent(
  config: AboutHomeConfig,
  featureCards: AboutHomeFeatureCard[] = [],
): AboutHomeContent {
  return {
    section: {
      visible: config.visible,
      label: config.sectionLabel,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
    },
    cta: {
      label: config.ctaLabel,
      href: config.ctaHref,
      visible: config.ctaVisible,
    },
    featureCards: mapAboutHomeAdminFeatureCards(featureCards),
  };
}
