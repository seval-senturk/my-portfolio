import type { NavigationItem } from "@/types/navigation";
import { ROUTES } from "@/constants/routes";
import { SECTION_IDS } from "@/constants/sections";
import { siteConfig } from "@/config/site.config";

export const brandConfig = {
  name: siteConfig.name,
  shortName: "SS",
  href: `${ROUTES.home}#${SECTION_IDS.hero}`,
} as const;

export const mainNavigation: readonly NavigationItem[] = [
  {
    label: "Home",
    href: `${ROUTES.home}#${SECTION_IDS.hero}`,
    sectionId: SECTION_IDS.hero,
    description: "Return to the top of the portfolio",
  },
  {
    label: "About",
    href: `${ROUTES.home}#${SECTION_IDS.about}`,
    sectionId: SECTION_IDS.about,
    description: "Professional background and summary",
  },
  {
    label: "Expertise",
    href: `${ROUTES.home}#${SECTION_IDS.expertise}`,
    sectionId: SECTION_IDS.expertise,
    description: "Technical expertise and core strengths",
  },
  {
    label: "Experience",
    href: `${ROUTES.home}#${SECTION_IDS.experience}`,
    sectionId: SECTION_IDS.experience,
    description: "Work history and education",
  },
  {
    label: "Projects",
    href: `${ROUTES.home}#${SECTION_IDS.projects}`,
    sectionId: SECTION_IDS.projects,
    description: "Featured projects and case studies",
  },
  {
    label: "Testimonials",
    href: `${ROUTES.home}#${SECTION_IDS.testimonials}`,
    sectionId: SECTION_IDS.testimonials,
    description: "Client and colleague feedback",
  },
  {
    label: "Blog",
    href: `${ROUTES.home}#${SECTION_IDS.blog}`,
    sectionId: SECTION_IDS.blog,
    description: "Latest articles and insights",
  },
  {
    label: "Contact",
    href: `${ROUTES.home}#${SECTION_IDS.contact}`,
    sectionId: SECTION_IDS.contact,
    description: "Get in touch",
  },
] as const;

export const footerNavigation: readonly NavigationItem[] = [
  ...mainNavigation,
] as const;

export const headerCta = {
  label: "Let's Talk",
  href: `${ROUTES.home}#${SECTION_IDS.contact}`,
} as const;

export const slideMenuConfig = {
  role: siteConfig.author.jobTitle,
  availabilityLabel: "Available for Work",
  resumeLabel: "Download Resume",
  resumeHref: ROUTES.resume,
  closeLabel: "Close",
} as const;

/** Standalone pages kept for SEO and deep links. */
export const secondaryNavigation: readonly NavigationItem[] = [
  {
    label: "All Projects",
    href: ROUTES.projects,
    description: "Full projects archive",
  },
  {
    label: "All Articles",
    href: ROUTES.blog,
    description: "Full blog archive",
  },
  {
    label: "Resume",
    href: ROUTES.resume,
    description: "Download resume",
  },
] as const;
