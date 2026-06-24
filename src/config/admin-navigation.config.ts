import { ADMIN_ROUTES } from "@/config/admin-routes.config";

export interface AdminNavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export const adminNavigation: readonly AdminNavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: ADMIN_ROUTES.dashboard,
    description: "Overview and content metrics",
  },
  {
    id: "projects",
    label: "Projects",
    href: ADMIN_ROUTES.projects,
    description: "Manage project showcase entries",
  },
  {
    id: "experience",
    label: "Experience",
    href: ADMIN_ROUTES.experience,
    description: "Manage work history entries",
  },
  {
    id: "skills",
    label: "Skills",
    href: ADMIN_ROUTES.skills,
    description: "Manage skills and expertise",
  },
  {
    id: "resume",
    label: "Resume",
    href: ADMIN_ROUTES.resume,
    description: "Manage resume center content",
  },
  {
    id: "blog",
    label: "Blog",
    href: ADMIN_ROUTES.blog,
    description: "Manage blog posts and categories",
  },
  {
    id: "contact",
    label: "Contact Messages",
    href: ADMIN_ROUTES.contact,
    description: "Review inbound contact leads",
  },
  {
    id: "settings",
    label: "Settings",
    href: ADMIN_ROUTES.settings,
    description: "Site and admin configuration",
  },
] as const;
