import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { HeroContent } from "@/types/hero";

export const heroContent = {
  eyebrow: "Hello! I'm",
  headline: siteConfig.author.name,
  summary: `${siteConfig.author.jobTitle} specializing in React, Next.js & AI-powered solutions.`,
  technologyHighlightsTitle: "Core Expertise",
  technologyHighlights: [
    {
      category: "Frontend",
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      technologies: ["Node.js", "REST APIs", "PostgreSQL"],
    },
    {
      category: "AI Integration",
      technologies: ["OpenAI API", "LLM Workflows"],
    },
    {
      category: "Cloud",
      technologies: ["Azure", "Vercel", "Docker"],
    },
  ],
  primaryCta: {
    label: "Get Resume",
    href: ROUTES.resume,
  },
  secondaryCta: {
    label: "View Projects",
    href: ROUTES.projects,
  },
  profile: {
    imageAlt: `${siteConfig.author.name} professional headshot`,
    initials: "SŞ",
  },
} as const satisfies HeroContent;
