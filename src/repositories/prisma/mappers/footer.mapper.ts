import type { FooterConfig, FooterNavLink, FooterResourceLink } from "@prisma/client";

import type { FooterLinkItem, SiteFooterContent } from "@/types/footer";

function mapFooterLinks<T extends { id: string; label: string; href: string; sortOrder: number; visible: boolean }>(
  links: T[],
): FooterLinkItem[] {
  return links
    .filter((link) => link.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      sortOrder: link.sortOrder,
      visible: link.visible,
    }));
}

export function mapFooterAdminLinks<T extends { id: string; label: string; href: string; sortOrder: number; visible: boolean }>(
  links: T[],
): FooterLinkItem[] {
  return [...links]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      sortOrder: link.sortOrder,
      visible: link.visible,
    }));
}

export function mapFooterConfigToAdminContent(
  config: FooterConfig,
  navigation: FooterNavLink[] = [],
  resources: FooterResourceLink[] = [],
): SiteFooterContent {
  return {
    brand: {
      logoUrl: config.brandLogoUrl,
      siteName: config.brandName,
      role: config.brandRole,
      description: config.brandDescription ?? "",
    },
    sectionLabels: {
      navigation: config.navSectionLabel,
      resources: config.resourcesSectionLabel,
      connect: config.connectSectionLabel,
    },
    navigation: mapFooterAdminLinks(navigation),
    resources: mapFooterAdminLinks(resources),
    connect: {
      title: config.ctaTitle,
      description: config.ctaDescription ?? "",
      ctaLabel: config.ctaLabel,
      ctaHref: config.ctaHref,
    },
    bottom: {
      copyright: config.copyright,
      backToTopEnabled: config.scrollToTopEnabled,
      backToTopLabel: config.scrollToTopLabel,
    },
    decor: {
      orbitalEnabled: config.orbitalDecorEnabled,
    },
  };
}

export function mapFooterConfigToContent(
  config: FooterConfig,
  navigation: FooterNavLink[] = [],
  resources: FooterResourceLink[] = [],
): SiteFooterContent {
  return {
    brand: {
      logoUrl: config.brandLogoUrl,
      siteName: config.brandName,
      role: config.brandRole,
      description: config.brandDescription ?? "",
    },
    sectionLabels: {
      navigation: config.navSectionLabel,
      resources: config.resourcesSectionLabel,
      connect: config.connectSectionLabel,
    },
    navigation: mapFooterLinks(navigation),
    resources: mapFooterLinks(resources),
    connect: {
      title: config.ctaTitle,
      description: config.ctaDescription ?? "",
      ctaLabel: config.ctaLabel,
      ctaHref: config.ctaHref,
    },
    bottom: {
      copyright: config.copyright,
      backToTopEnabled: config.scrollToTopEnabled,
      backToTopLabel: config.scrollToTopLabel,
    },
    decor: {
      orbitalEnabled: config.orbitalDecorEnabled,
    },
  };
}
