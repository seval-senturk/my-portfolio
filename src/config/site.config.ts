import type { SiteConfig } from "@/types/site";

export const siteConfig = {
  name: "Seval Şentürk",
  title: "Seval Şentürk | Frontend & Full Stack Developer",
  description:
    "Professional portfolio and career site of Seval Şentürk, Frontend & Full Stack Developer.",
  locale: "en_US",
  language: "en",
  author: {
    name: "Seval Şentürk",
    jobTitle: "Frontend & Full Stack Developer",
    email: "hello@sevalsenturk.com",
  },
} as const satisfies SiteConfig;
