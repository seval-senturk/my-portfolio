export interface SiteFooterContent {
  newsletter: {
    enabled: boolean;
    label: string;
    title: string;
    description: string | null;
    placeholder: string;
    buttonText: string;
  };
  contact: {
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  brand: {
    logoUrl: string | null;
    siteName: string;
    copyright: string;
  };
  scrollToTop: {
    enabled: boolean;
  };
}

export interface FooterConfigInput {
  newsletterEnabled: boolean;
  newsletterLabel: string;
  newsletterTitle: string;
  newsletterDescription: string | null;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  copyright: string;
  brandName: string;
  brandLogoUrl: string | null;
  scrollToTopEnabled: boolean;
}
