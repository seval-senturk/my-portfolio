import { siteConfig } from "@/config/site.config";
import { professionalHighlights } from "@/data/professional-highlights.data";
import type { AboutContent } from "@/types/about";

export const aboutContent = {
  section: {
    title: "About Me",
    description:
      "A professional overview of my background, expertise, and approach to building modern web applications.",
  },
  introduction: {
    paragraphs: [
      `I am ${siteConfig.author.name}, a ${siteConfig.author.jobTitle} with 5+ years of experience delivering production-ready applications across frontend, backend, and cloud environments.`,
      "I specialize in React, Next.js, and TypeScript — combining strong UI engineering with scalable API design. My focus is on building software that is performant, accessible, and maintainable.",
      "I work closely with product and engineering teams to translate business requirements into reliable technical solutions, from architecture decisions to deployment.",
    ],
  },
  story: {
    title: "Professional Journey",
    paragraphs: [
      "I began my career focusing on frontend development, building responsive interfaces and design systems with React and modern CSS. This foundation shaped my attention to detail, user experience, and code quality.",
      "Over time, I expanded into full stack development — designing REST APIs, working with PostgreSQL, and deploying applications on Azure and Vercel. This end-to-end perspective allows me to own features from UI to infrastructure.",
      "Recently, I have integrated AI capabilities into web applications using OpenAI APIs and LLM workflows, helping teams automate workflows and deliver intelligent user experiences without compromising performance or reliability.",
    ],
  },
  coreExpertise: {
    title: "Core Expertise",
    items: [
      {
        title: "Frontend Development",
        description:
          "Building responsive, component-driven interfaces with modern JavaScript frameworks and design systems.",
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "Full Stack Development",
        description:
          "Designing and implementing end-to-end features spanning client applications, APIs, and databases.",
        technologies: ["Node.js", "REST APIs", "PostgreSQL"],
      },
      {
        title: "AI Integration",
        description:
          "Embedding intelligent features into web products using large language models and structured workflows.",
        technologies: ["OpenAI API", "LLM Workflows", "Prompt Engineering"],
      },
      {
        title: "Performance Optimization",
        description:
          "Improving Core Web Vitals, bundle size, and runtime performance for production applications.",
        technologies: ["Lighthouse", "Code Splitting", "Caching"],
      },
      {
        title: "UI Engineering",
        description:
          "Creating consistent, accessible component libraries and interaction patterns for scalable products.",
        technologies: ["Design Systems", "WCAG", "Responsive Design"],
      },
      {
        title: "SEO & Accessibility",
        description:
          "Building discoverable, standards-compliant applications that perform well for users and search engines.",
        technologies: ["Semantic HTML", "JSON-LD", "ARIA"],
      },
    ],
  },
  workingPrinciples: {
    title: "Working Principles",
    items: [
      {
        title: "Clean Code",
        description:
          "Readable, well-structured code that teams can maintain and extend with confidence.",
      },
      {
        title: "Scalability",
        description:
          "Architectures and patterns that support growth without unnecessary complexity.",
      },
      {
        title: "User Experience",
        description:
          "Interfaces that are intuitive, fast, and designed around real user needs.",
      },
      {
        title: "Performance First",
        description:
          "Optimizing load times and runtime behavior as a core requirement, not an afterthought.",
      },
      {
        title: "Accessibility",
        description:
          "Inclusive design practices that ensure products work for all users.",
      },
      {
        title: "SEO Driven Development",
        description:
          "Semantic structure and metadata strategies that support organic visibility.",
      },
    ],
  },
  professionalHighlights: {
    title: "Professional Highlights",
    items: professionalHighlights,
  },
  personalValues: {
    title: "Professional Values",
    items: [
      {
        title: "Continuous Learning",
        description:
          "Staying current with evolving tools, frameworks, and industry best practices.",
      },
      {
        title: "Problem Solving",
        description:
          "Breaking down complex challenges into clear, actionable technical solutions.",
      },
      {
        title: "Collaboration",
        description:
          "Working effectively with cross-functional teams to deliver shared outcomes.",
      },
      {
        title: "Ownership",
        description:
          "Taking responsibility for features from planning through production support.",
      },
      {
        title: "Quality Focus",
        description:
          "Delivering work that meets high standards for reliability, testing, and polish.",
      },
    ],
  },
} as const satisfies AboutContent;
