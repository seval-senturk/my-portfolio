import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { AboutHomeContent } from "@/types/about-home";

export const aboutHomeContent: AboutHomeContent = {
  section: {
    visible: true,
    label: "WHO I AM",
    title: "About Me",
    titleAccent: "Me",
    description:
      "I'm a Frontend Developer & UI/UX Designer with 8+ years of experience crafting clean, high-performance digital products. I focus on thoughtful interfaces, scalable architecture, and experiences that feel fast, accessible, and genuinely useful.",
  },
  profile: {
    imageAlt: `${siteConfig.author.name} professional portrait`,
    initials: "SŞ",
    visible: true,
  },
  cta: {
    label: "Let's Talk",
    href: "#contact",
    visible: true,
  },
  secondaryCta: {
    label: "Download Resume",
    href: ROUTES.resume,
    visible: true,
  },
  featureCards: [
    {
      id: "about-info-01",
      number: "",
      icon: "briefcase",
      title: "Experience",
      description: "8+ Years",
      visible: true,
      sortOrder: 0,
    },
    {
      id: "about-info-02",
      number: "",
      icon: "rocket",
      title: "Availability",
      description: "Open to Opportunities",
      visible: true,
      sortOrder: 1,
    },
    {
      id: "about-info-03",
      number: "",
      icon: "map-pin",
      title: "Location",
      description: "Istanbul, Turkey",
      visible: true,
      sortOrder: 2,
    },
    {
      id: "about-info-04",
      number: "",
      icon: "languages",
      title: "Languages",
      description: "English, Turkish",
      visible: true,
      sortOrder: 3,
    },
    {
      id: "about-info-05",
      number: "",
      icon: "mail",
      title: "Email",
      description: siteConfig.author.email,
      visible: true,
      sortOrder: 4,
    },
    {
      id: "about-info-06",
      number: "",
      icon: "globe",
      title: "Remote Work",
      description: "Available Worldwide",
      visible: true,
      sortOrder: 5,
    },
  ],
};
