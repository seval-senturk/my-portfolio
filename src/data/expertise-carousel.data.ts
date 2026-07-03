import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";

export const expertiseCarouselContent: ExpertiseCarouselContent = {
  section: {
    label: "My Expertise",
    title: "Building Modern Digital Products.",
    titleAccent: "Products",
    description:
      "Full-stack engineering with a focus on polished interfaces, scalable systems, and thoughtful product craft.",
    visible: true,
  },
  items: [
    {
      id: "expertise-ui-ux",
      icon: "Layers",
      title: "UI/UX Design",
      description: "",
      bulletItems: [
        "Landing Pages",
        "User Flow",
        "Wireframing",
        "Prototyping",
        "Mobile App Design",
      ],
      visible: true,
      sortOrder: 0,
    },
    {
      id: "expertise-development",
      icon: "Code2",
      title: "Development",
      description: "",
      bulletItems: [
        "HTML/CSS",
        "JavaScript",
        "Animation",
        "WordPress",
        "React",
      ],
      visible: true,
      sortOrder: 1,
    },
    {
      id: "expertise-backend",
      icon: "Server",
      title: "Backend & APIs",
      description: "",
      bulletItems: [
        "Node.js",
        "REST APIs",
        "PostgreSQL",
        "Prisma ORM",
        "Auth & Security",
      ],
      visible: true,
      sortOrder: 2,
    },
    {
      id: "expertise-product",
      icon: "Sparkles",
      title: "Product Engineering",
      description: "",
      bulletItems: [
        "System Design",
        "Performance",
        "SEO & Accessibility",
        "Admin Panels",
        "Cloud Deployments",
      ],
      visible: true,
      sortOrder: 3,
    },
  ],
};
