import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";
import { ROUTES } from "@/constants/routes";

export const expertiseCarouselContent: ExpertiseCarouselContent = {
  section: {
    label: "Expertise",
    title: "Building Modern Digital Products.",
    titleAccent: "Products",
    description:
      "Full-stack engineering with a focus on polished interfaces, scalable systems, and thoughtful product craft.",
    visible: true,
  },
  items: [
    {
      id: "expertise-ui-ux",
      icon: "PenTool",
      title: "UI / UX Design",
      description:
        "Crafting intuitive, visually striking interfaces backed by solid user research and interaction design principles.",
      bulletItems: [
        "Wireframing & Prototyping",
        "Design Systems",
        "Usability Testing",
        "Figma / Adobe XD",
      ],
      ctaLabel: "Explore Service",
      ctaHref: ROUTES.projects,
      visible: true,
      sortOrder: 0,
    },
    {
      id: "expertise-development",
      icon: "Code2",
      title: "Frontend Development",
      description:
        "Building fast, accessible and maintainable interfaces with modern frameworks, strong performance and clean component architecture.",
      bulletItems: [
        "React & Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Core Web Vitals",
      ],
      ctaLabel: "Explore Service",
      ctaHref: ROUTES.projects,
      visible: true,
      sortOrder: 1,
    },
    {
      id: "expertise-backend",
      icon: "Server",
      title: "Backend & APIs",
      description:
        "Designing reliable server-side systems, secure APIs and data layers that scale cleanly as products grow.",
      bulletItems: [
        "Node.js",
        "REST APIs",
        "PostgreSQL",
        "Auth & Security",
      ],
      ctaLabel: "Explore Service",
      ctaHref: ROUTES.projects,
      visible: true,
      sortOrder: 2,
    },
    {
      id: "expertise-product",
      icon: "Sparkles",
      title: "Product Engineering",
      description:
        "Shipping end-to-end digital products with thoughtful architecture, SEO foundations and cloud-ready deployment workflows.",
      bulletItems: [
        "System Design",
        "Performance",
        "SEO & Accessibility",
        "Admin Panels",
      ],
      ctaLabel: "Explore Service",
      ctaHref: ROUTES.contact,
      visible: true,
      sortOrder: 3,
    },
  ],
};
