import type { FooterConfig } from "@prisma/client";

import type { SiteFooterContent } from "@/types/footer";

export function mapFooterConfigToContent(
  config: FooterConfig,
): SiteFooterContent {
  return {
    newsletter: {
      enabled: config.newsletterEnabled,
      label: config.newsletterLabel,
      title: config.newsletterTitle,
      description: config.newsletterDescription,
      placeholder: config.newsletterPlaceholder,
      buttonText: config.newsletterButtonText,
    },
    contact: {
      phone: config.phone,
      email: config.email,
      address: config.address,
    },
    brand: {
      logoUrl: config.brandLogoUrl,
      siteName: config.brandName,
      copyright: config.copyright,
    },
    scrollToTop: {
      enabled: config.scrollToTopEnabled,
    },
  };
}
