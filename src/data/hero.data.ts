import { heroHighlights } from "@/data/professional-highlights.data";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { HeroContent } from "@/types/hero";

export const heroContent = {
  eyebrow: "Frontend & Full Stack Developer",
  headline: `${siteConfig.author.name} — ${siteConfig.author.jobTitle}`,
  summary:
    "Full Stack Developer with 5+ years of experience building scalable web applications. I specialize in React, Next.js, and TypeScript — delivering performant interfaces, reliable APIs, and AI-powered solutions that create measurable business value.",
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
    label: "Download Resume",
    href: ROUTES.resume,
  },
  secondaryCta: {
    label: "Contact Me",
    href: ROUTES.contact,
  },
  socialProof: heroHighlights.map(({ label, value }) => ({ label, value })),
  profile: {
    imageAlt: `${siteConfig.author.name} professional headshot`,
    initials: "SŞ",
  },
} as const satisfies HeroContent;
