import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import type { SiteFooterContent } from "@/types/footer";

export const siteFooterContent: SiteFooterContent = {
  brand: {
    logoUrl: null,
    siteName: siteConfig.author.name,
    role: "FRONTEND DEVELOPER",
    description:
      "Frontend & full stack developer crafting clean, performant web experiences with modern JavaScript, React, and thoughtful UI design.",
  },
  sectionLabels: {
    navigation: "Navigation",
    resources: "Resources",
    connect: "Let's Connect",
  },
  navigation: [
    { id: "footer-nav-home", label: "Home", href: ROUTES.home, sortOrder: 0, visible: true },
    { id: "footer-nav-about", label: "About", href: ROUTES.about, sortOrder: 1, visible: true },
    { id: "footer-nav-resume", label: "Resume", href: ROUTES.resume, sortOrder: 2, visible: true },
    {
      id: "footer-nav-projects",
      label: "Projects",
      href: ROUTES.projects,
      sortOrder: 3,
      visible: true,
    },
    { id: "footer-nav-blog", label: "Blog", href: ROUTES.blog, sortOrder: 4, visible: true },
    {
      id: "footer-nav-contact",
      label: "Contact",
      href: ROUTES.contact,
      sortOrder: 5,
      visible: true,
    },
  ],
  resources: [
    {
      id: "footer-resource-resume",
      label: "Download Resume",
      href: ROUTES.resume,
      sortOrder: 0,
      visible: true,
    },
    {
      id: "footer-resource-stack",
      label: "Tech Stack",
      href: ROUTES.skills,
      sortOrder: 1,
      visible: true,
    },
    {
      id: "footer-resource-cases",
      label: "Case Studies",
      href: ROUTES.projects,
      sortOrder: 2,
      visible: true,
    },
    {
      id: "footer-resource-privacy",
      label: "Privacy Policy",
      href: ROUTES.contact,
      sortOrder: 3,
      visible: true,
    },
  ],
  connect: {
    title: "Let's build something together.",
    description: "Have a project in mind or want to collaborate? I'd love to hear from you.",
    ctaLabel: "Contact Me",
    ctaHref: ROUTES.contact,
  },
  bottom: {
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}. All rights reserved.`,
    backToTopEnabled: true,
    backToTopLabel: "Back to top",
  },
  decor: {
    orbitalEnabled: true,
  },
};
