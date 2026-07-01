import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { AboutHomeContent } from "@/types/about-home";

export const aboutHomeContent: AboutHomeContent = {
  section: {
    visible: true,
    label: "Who I Am",
    title: "About Me",
    titleAccent: "Me",
    description:
      "I am a frontend and full stack developer focused on building reliable, performant web products. I combine strong UI engineering with scalable backend patterns to deliver experiences that feel polished and ship with confidence.",
  },
  profile: {
    imageUrl: null,
    imageAlt: `${siteConfig.author.name} professional portrait`,
  },
  quickInfo: [
    {
      id: "about-qi-experience",
      icon: "briefcase",
      label: "Experience",
      value: "5+ Years",
      visible: true,
      sortOrder: 0,
    },
    {
      id: "about-qi-location",
      icon: "map-pin",
      label: "Location",
      value: "Turkey",
      visible: true,
      sortOrder: 1,
    },
    {
      id: "about-qi-email",
      icon: "mail",
      label: "Email",
      value: siteConfig.author.email,
      visible: true,
      sortOrder: 2,
    },
    {
      id: "about-qi-languages",
      icon: "languages",
      label: "Languages",
      value: "English, Turkish",
      visible: true,
      sortOrder: 3,
    },
    {
      id: "about-qi-availability",
      icon: "calendar-check",
      label: "Availability",
      value: "Open to opportunities",
      visible: true,
      sortOrder: 4,
    },
    {
      id: "about-qi-remote",
      icon: "globe",
      label: "Remote Work",
      value: "Available worldwide",
      visible: true,
      sortOrder: 5,
    },
  ],
  stats: [
    {
      id: "about-stat-years",
      icon: "user",
      value: "5+",
      label: "Years Experience",
      visible: true,
      sortOrder: 0,
    },
    {
      id: "about-stat-projects",
      icon: "rocket",
      value: "40+",
      label: "Completed Projects",
      visible: true,
      sortOrder: 1,
    },
    {
      id: "about-stat-clients",
      icon: "star",
      value: "25+",
      label: "Happy Clients",
      visible: true,
      sortOrder: 2,
    },
  ],
  actions: {
    primary: {
      label: "Download Resume",
      href: ROUTES.resume,
      visible: true,
    },
    secondary: {
      label: "Let's Talk",
      href: ROUTES.contact,
      visible: true,
    },
  },
};
