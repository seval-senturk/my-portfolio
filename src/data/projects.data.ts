import type { ProjectsContent } from "@/types/project";

export const projectsContent = {
  section: {
    title: "Projects",
    description:
      "Selected projects demonstrating full stack development, performance optimization, and AI integration across real-world applications.",
  },
  featured: {
    title: "Featured Projects",
  },
  additional: {
    title: "More Projects",
  },
  entries: [
    {
      id: "proj-001",
      slug: "ai-workflow-platform",
      title: "AI Workflow Automation Platform",
      shortDescription:
        "A full stack SaaS platform that integrates OpenAI APIs to automate document processing workflows for business teams.",
      longDescription:
        "End-to-end SaaS application enabling teams to configure AI-powered document workflows with real-time processing, audit logs, and role-based access control.",
      category: "AI",
      status: "Live",
      client: "TechVenture Solutions",
      role: "Frontend & Full Stack Developer",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "OpenAI API",
        "Tailwind CSS",
        "Azure",
      ],
      githubUrl: "https://github.com/sevalsenturk",
      liveUrl: "https://example.com",
      featured: true,
      highlights: [
        "AI-powered document classification pipeline",
        "Real-time workflow status dashboard",
        "Role-based access control",
      ],
      caseStudy: {
        problem:
          "Business teams spent hours manually processing and categorizing incoming documents, causing delays and inconsistent results.",
        solution:
          "Built a full stack platform with configurable AI workflows, automated classification, and a monitoring dashboard for operations teams.",
        technologies: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "OpenAI API",
        ],
        challenges: [
          "Managing LLM response latency without blocking the UI",
          "Designing a flexible workflow engine for non-technical users",
          "Ensuring data privacy for sensitive document content",
        ],
        results: [
          "Reduced manual processing time by 60%",
          "Improved classification accuracy to 92%",
          "Onboarded 3 enterprise teams within the first quarter",
        ],
      },
      metrics: [
        { label: "Processing Time Reduction", value: "60%" },
        { label: "Classification Accuracy", value: "92%" },
      ],
    },
    {
      id: "proj-002",
      slug: "ecommerce-storefront",
      title: "E-Commerce Storefront",
      shortDescription:
        "A high-performance e-commerce storefront with SEO optimization, accessible UI, and integrated payment flows.",
      longDescription:
        "Modern e-commerce platform built with Next.js featuring server-side rendering, optimized product catalog, and conversion-focused checkout experience.",
      category: "E-Commerce",
      status: "Live",
      role: "Frontend Developer",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Stripe",
        "PostgreSQL",
        "Vercel",
      ],
      githubUrl: "https://github.com/sevalsenturk",
      liveUrl: "https://example.com",
      featured: true,
      highlights: [
        "Server-side rendered product pages",
        "Accessible checkout flow",
        "Core Web Vitals optimized",
      ],
      caseStudy: {
        problem:
          "An existing e-commerce site suffered from slow load times, poor mobile experience, and low organic search visibility.",
        solution:
          "Rebuilt the storefront with Next.js SSR, implemented semantic SEO structure, and optimized images and bundle size for performance.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
        challenges: [
          "Migrating legacy product data without downtime",
          "Balancing rich product imagery with fast load times",
          "Maintaining SEO rankings during the migration",
        ],
        results: [
          "Lighthouse Performance score improved to 95+",
          "Organic traffic increased by 35% within 3 months",
          "Mobile conversion rate improved by 22%",
        ],
      },
      metrics: [
        { label: "Lighthouse Performance", value: "95+" },
        { label: "Organic Traffic Growth", value: "35%" },
      ],
    },
    {
      id: "proj-003",
      slug: "design-system-dashboard",
      title: "Design System & Analytics Dashboard",
      shortDescription:
        "A component-driven analytics dashboard with a shared design system used across multiple internal products.",
      longDescription:
        "Internal analytics dashboard featuring a reusable component library, data visualization modules, and role-based views for product teams.",
      category: "SaaS",
      status: "Live",
      client: "DigitalCraft Agency",
      role: "Frontend Developer",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "REST APIs",
        "Chart.js",
      ],
      githubUrl: "https://github.com/sevalsenturk",
      featured: true,
      highlights: [
        "Reusable component library",
        "Responsive data visualization",
        "WCAG 2.1 AA compliance",
      ],
      caseStudy: {
        problem:
          "Multiple internal products had inconsistent UI patterns, slowing development and creating accessibility issues.",
        solution:
          "Created a shared design system and analytics dashboard template adopted across three product teams.",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        challenges: [
          "Aligning design tokens across products with different requirements",
          "Ensuring chart components remained accessible",
        ],
        results: [
          "Reduced UI development time by 40% for new features",
          "Achieved WCAG 2.1 AA compliance across all dashboard views",
        ],
      },
    },
    {
      id: "proj-004",
      slug: "cms-content-platform",
      title: "Headless CMS Content Platform",
      shortDescription:
        "A headless CMS-powered content platform with multi-language support and SEO-optimized page generation.",
      longDescription:
        "Content management platform integrating a headless CMS with a Next.js frontend for marketing teams to publish SEO-optimized pages.",
      category: "CMS",
      status: "Private",
      role: "Full Stack Developer",
      technologies: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS",
      ],
      featured: false,
      highlights: [
        "Headless CMS integration",
        "Multi-language content support",
        "Automated sitemap generation",
      ],
      caseStudy: {
        problem:
          "Marketing teams needed a faster way to publish localized content without developer involvement for every update.",
        solution:
          "Built a headless CMS integration with preview mode, automated SEO metadata, and multi-language routing.",
        technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
        challenges: [
          "Designing preview mode that matched production rendering",
          "Handling content fallbacks across languages",
        ],
        results: [
          "Content publish time reduced from days to hours",
          "SEO metadata automatically generated for all pages",
        ],
      },
    },
    {
      id: "proj-005",
      slug: "portfolio-platform",
      title: "Personal Portfolio Platform",
      shortDescription:
        "This portfolio and career platform — built with Next.js, TypeScript, and a modular feature-based architecture.",
      longDescription:
        "A production-quality personal portfolio designed for recruiters, ATS compatibility, SEO visibility, and future content expansion.",
      category: "Full Stack",
      status: "In Progress",
      role: "Frontend & Full Stack Developer",
      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "React",
        "Vercel",
      ],
      githubUrl: "https://github.com/sevalsenturk",
      featured: false,
      highlights: [
        "ATS-friendly content structure",
        "SEO-first architecture",
        "Feature-based modular design",
      ],
    },
  ],
} as const satisfies ProjectsContent;
