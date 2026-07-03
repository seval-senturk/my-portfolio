export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  visible: boolean;
}

export interface FooterLinkInput {
  id?: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface SiteFooterContent {
  brand: {
    logoUrl: string | null;
    siteName: string;
    role: string;
    description: string;
  };
  sectionLabels: {
    navigation: string;
    resources: string;
    connect: string;
  };
  navigation: readonly FooterLinkItem[];
  resources: readonly FooterLinkItem[];
  connect: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  bottom: {
    copyright: string;
    backToTopEnabled: boolean;
    backToTopLabel: string;
  };
  decor: {
    orbitalEnabled: boolean;
  };
}

export interface FooterConfigInput {
  brandName: string;
  brandLogoUrl: string | null;
  brandRole: string;
  brandDescription: string | null;
  navSectionLabel: string;
  resourcesSectionLabel: string;
  connectSectionLabel: string;
  ctaTitle: string;
  ctaDescription: string | null;
  ctaLabel: string;
  ctaHref: string;
  copyright: string;
  scrollToTopEnabled: boolean;
  scrollToTopLabel: string;
  orbitalDecorEnabled: boolean;
}
