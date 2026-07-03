import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { HeroContent } from "@/types/hero";

export const heroContent = {
  eyebrow: "Hello, I'm",
  headline: siteConfig.author.name,
  jobTitle: siteConfig.author.jobTitle,
  summary:
    "Frontend Developer focused on building clean, responsive and high-performance web applications with modern technologies.",
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
    label: "View My Projects",
    href: ROUTES.projects,
    visible: true,
  },
  secondaryCta: {
    label: "Download Resume",
    href: ROUTES.resume,
    visible: true,
  },
  profile: {
    imageAlt: `${siteConfig.author.name} professional portrait`,
    initials: "SŞ",
    visible: true,
  },
  orbitalLinesEnabled: false,
  statsEnabled: true,
  technologyCards: [
    {
      id: "hero-tech-dotnet",
      icon: "dotnet",
      title: ".NET",
      position: 0,
      sortOrder: 0,
      visible: true,
    },
    {
      id: "hero-tech-css",
      icon: "css",
      title: "CSS3",
      position: 1,
      sortOrder: 1,
      visible: true,
    },
    {
      id: "hero-tech-html",
      icon: "html",
      title: "HTML5",
      position: 2,
      sortOrder: 2,
      visible: true,
    },
    {
      id: "hero-tech-javascript",
      icon: "javascript",
      title: "JavaScript",
      position: 3,
      sortOrder: 3,
      visible: true,
    },
    {
      id: "hero-tech-react",
      icon: "react",
      title: "React",
      position: 4,
      sortOrder: 4,
      visible: true,
    },
    {
      id: "hero-tech-java",
      icon: "java",
      title: "Java",
      position: 5,
      sortOrder: 5,
      visible: true,
    },
  ],
  stats: [
    {
      id: "hero-stat-experience",
      icon: "code",
      value: "8+",
      label: "Years Experience",
      sortOrder: 0,
      visible: true,
    },
    {
      id: "hero-stat-projects",
      icon: "folder",
      value: "90+",
      label: "Projects Completed",
      sortOrder: 1,
      visible: true,
    },
    {
      id: "hero-stat-clients",
      icon: "users",
      value: "40+",
      label: "Happy Clients",
      sortOrder: 2,
      visible: true,
    },
    {
      id: "hero-stat-rating",
      icon: "star",
      value: "5.0",
      label: "Client Rating",
      sortOrder: 3,
      visible: true,
    },
  ],
} as const satisfies HeroContent;
