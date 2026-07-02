import { siteConfig } from "@/config/site.config";

export const seoConfig = {
  defaultTitle: siteConfig.title,
  titleTemplate: "%s | Seval Şentürk",
  defaultDescription: siteConfig.description,
  defaultKeywords: [
    "Seval Şentürk",
    "Frontend Developer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "CV",
  ],
  twitterHandle: "@sevalsenturk",
  ogImagePath: "/og-image.png",
  /** Portfolio favicon — public/icons/favicon.ico */
  faviconPath: "/icons/favicon.ico",
} as const;
