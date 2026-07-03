import { ROUTES } from "@/constants/routes";
import type { AboutHomeContent } from "@/types/about-home";

export const aboutHomeContent: AboutHomeContent = {
  section: {
    visible: true,
    label: "ABOUT",
    title: "I build digital\nexperiences\nthat make a difference.",
    titleAccent: "experiences",
    description:
      "I don't just write code — I solve real problems and ship products that scale. From architecture to deployment, I focus on clean code, strong performance, and experiences people actually enjoy using.\n\nEvery project is an opportunity to balance engineering discipline with thoughtful design, delivering solutions that are fast, accessible, and built to grow.",
  },
  cta: {
    label: "More About My Journey",
    href: ROUTES.about,
    visible: true,
  },
  featureCards: [
    {
      id: "about-fc-01",
      number: "01",
      icon: "code",
      title: "Clean Architecture",
      description:
        "Modern layered architecture, maintainable code, and scalable project structures built for long-term growth.",
      visible: true,
      sortOrder: 0,
    },
    {
      id: "about-fc-02",
      number: "02",
      icon: "zap",
      title: "Performance First",
      description:
        "Core Web Vitals, Lighthouse optimization, and fast user experiences that feel instant on every device.",
      visible: true,
      sortOrder: 1,
    },
    {
      id: "about-fc-03",
      number: "03",
      icon: "search",
      title: "SEO & Accessibility",
      description:
        "Semantic HTML, WCAG standards, and advanced SEO infrastructure that helps products reach more people.",
      visible: true,
      sortOrder: 2,
    },
    {
      id: "about-fc-04",
      number: "04",
      icon: "brain",
      title: "AI Integrated Solutions",
      description:
        "OpenAI integrations, automation systems, and intelligent workflows that streamline how teams work.",
      visible: true,
      sortOrder: 3,
    },
  ],
};
