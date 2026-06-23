import { siteConfig } from "@/config/site.config";

export const footerContent = {
  tagline: `${siteConfig.author.jobTitle}. Building reliable, scalable web experiences with a focus on performance and user experience.`,
  columns: {
    quickLinks: "Quick Links",
    connect: "Connect",
  },
  copyrightSuffix: "All rights reserved.",
} as const;
