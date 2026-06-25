import type { NavigationItem } from "@/types/navigation";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";

export const brandConfig = {
  name: siteConfig.name,
  shortName: "SS",
  href: ROUTES.home,
} as const;

export const mainNavigation: readonly NavigationItem[] = [
  {
    label: "About",
    href: ROUTES.about,
    description: "Professional background and summary",
  },
  {
    label: "Experience",
    href: ROUTES.experience,
    description: "Work history and roles",
  },
  {
    label: "Projects",
    href: ROUTES.projects,
    description: "Selected projects and case studies",
  },
  {
    label: "Blog",
    href: ROUTES.blog,
    description: "Technical articles, tutorials, and insights",
  },
  {
    label: "Skills",
    href: ROUTES.skills,
    description: "Technical skills and expertise",
  },
  {
    label: "Resume",
    href: ROUTES.resume,
    description: "ATS-friendly resume and CV download",
  },
  {
    label: "Contact",
    href: ROUTES.contact,
    description: "Get in touch",
  },
] as const;

export const footerNavigation: readonly NavigationItem[] = [
  {
    label: "Home",
    href: ROUTES.home,
    description: "Return to homepage",
  },
  ...mainNavigation,
] as const;

export const headerCta = {
  label: "Download CV",
  href: ROUTES.resume,
} as const;
