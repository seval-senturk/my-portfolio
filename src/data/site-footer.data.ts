import { siteConfig } from "@/config/site.config";
import type { SiteFooterContent } from "@/types/footer";

export const siteFooterContent: SiteFooterContent = {
  newsletter: {
    enabled: true,
    label: "Get Latest Updates",
    title: "Subscribe For Newsletter",
    description:
      "Occasional notes on frontend craft, projects, and lessons from the field — no spam.",
    placeholder: "hello@example.com",
    buttonText: "Subscribe Now",
  },
  contact: {
    phone: null,
    email: siteConfig.author.email,
    address: null,
  },
  brand: {
    logoUrl: null,
    siteName: siteConfig.author.name,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}. All rights reserved.`,
  },
  scrollToTop: {
    enabled: true,
  },
};
