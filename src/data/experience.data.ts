import type { ExperienceContent } from "@/types/experience";

export const experienceContent = {
  section: {
    label: "MY JOURNEY",
    title: "Experience",
    description:
      "Professional work history highlighting roles, technologies, and measurable impact across frontend and full stack development.",
    visible: true,
    cta: {
      label: "View full resume and download CV",
      href: "/resume",
      visible: true,
    },
  },
  entries: [
    {
      id: "exp-001",
      company: "TechVenture Solutions",
      position: "Frontend & Full Stack Developer",
      employmentType: "Full-time",
      location: "Istanbul, Turkey · Remote",
      startDate: { month: 1, year: 2024 },
      current: true,
      summary:
        "Leading development of customer-facing web applications and internal tools using React, Next.js, and Node.js. Driving performance, accessibility, and AI-powered feature integration.",
      responsibilities: [
        "Develop and maintain production Next.js applications with TypeScript and modern React patterns.",
        "Design and implement RESTful APIs and database integrations for full stack features.",
        "Integrate OpenAI APIs to deliver intelligent workflow automation within web products.",
        "Collaborate with product and design teams to ship accessible, SEO-optimized interfaces.",
        "Improve Core Web Vitals and application performance through code splitting and caching strategies.",
      ],
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "OpenAI API",
        "Azure",
        "Tailwind CSS",
      ],
      achievements: [
        "Reduced page load time by 40% through performance optimization and bundle analysis.",
        "Delivered an AI-assisted feature that automated a key internal workflow.",
        "Established component library patterns adopted across multiple product teams.",
      ],
    },
    {
      id: "exp-002",
      company: "DigitalCraft Agency",
      position: "Frontend Developer",
      employmentType: "Full-time",
      location: "Istanbul, Turkey",
      startDate: { month: 6, year: 2021 },
      endDate: { month: 12, year: 2023 },
      summary:
        "Built responsive web applications and design systems for agency clients across e-commerce and SaaS sectors.",
      responsibilities: [
        "Implemented pixel-perfect, responsive interfaces from Figma designs using React.",
        "Created reusable component libraries to accelerate project delivery.",
        "Optimized client websites for SEO, accessibility, and mobile performance.",
        "Participated in code reviews and mentored junior developers on frontend best practices.",
      ],
      technologies: [
        "React",
        "JavaScript",
        "TypeScript",
        "CSS",
        "Tailwind CSS",
        "REST APIs",
        "Git",
      ],
      achievements: [
        "Delivered 10+ client projects on schedule with consistently positive feedback.",
        "Improved Lighthouse accessibility scores to 95+ across multiple client sites.",
      ],
    },
    {
      id: "exp-003",
      company: "StartUp Labs",
      position: "Junior Frontend Developer",
      employmentType: "Full-time",
      location: "Istanbul, Turkey",
      startDate: { month: 3, year: 2019 },
      endDate: { month: 5, year: 2021 },
      summary:
        "Contributed to early-stage product development, focusing on UI implementation and frontend architecture foundations.",
      responsibilities: [
        "Developed user interfaces for a SaaS dashboard using React and component-based architecture.",
        "Integrated frontend applications with backend REST APIs.",
        "Wrote unit tests and participated in agile sprint planning and retrospectives.",
        "Fixed bugs and improved UI consistency across the application.",
      ],
      technologies: ["React", "JavaScript", "HTML", "CSS", "REST APIs", "Jest"],
    },
  ],
} as const satisfies ExperienceContent;
