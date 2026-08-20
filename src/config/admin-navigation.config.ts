import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Image,
  LayoutGrid,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  PanelBottom,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  Wrench,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { ONE_PAGE_SECTION_IDS } from "@/constants/sections";
import type { SectionId } from "@/constants/sections";
import { adminTr } from "@/features/admin/i18n/tr";

export interface AdminNavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon: LucideIcon;
  section: "main" | "content" | "pages" | "system";
}

/** Maps public homepage section ids to admin nav item ids. */
const HOME_SECTION_ADMIN_NAV_IDS: Record<SectionId, string> = {
  hero: "hero",
  about: "about",
  expertise: "expertise-carousel",
  experience: "experience",
  projects: "projects",
  testimonials: "testimonials",
  blog: "blog",
  contact: "contact",
};

const ADMIN_NAV_ITEMS: Record<string, AdminNavigationItem> = {
  dashboard: {
    id: "dashboard",
    label: adminTr.nav.dashboard,
    href: ADMIN_ROUTES.dashboard,
    description: adminTr.dashboard.description,
    icon: LayoutDashboard,
    section: "main",
  },
  hero: {
    id: "hero",
    label: adminTr.nav.hero,
    href: ADMIN_ROUTES.hero,
    description: adminTr.hero.description,
    icon: Sparkles,
    section: "content",
  },
  about: {
    id: "about",
    label: adminTr.nav.about,
    href: ADMIN_ROUTES.about,
    description: adminTr.about.description,
    icon: User,
    section: "content",
  },
  "expertise-carousel": {
    id: "expertise-carousel",
    label: adminTr.nav.expertiseCarousel,
    href: ADMIN_ROUTES.expertiseCarousel,
    description: adminTr.expertiseCarousel.description,
    icon: LayoutGrid,
    section: "content",
  },
  experience: {
    id: "experience",
    label: adminTr.nav.experience,
    href: ADMIN_ROUTES.experience,
    description: adminTr.experience.description,
    icon: Briefcase,
    section: "content",
  },
  projects: {
    id: "projects",
    label: adminTr.nav.projects,
    href: ADMIN_ROUTES.projects,
    description: adminTr.projects.description,
    icon: FolderKanban,
    section: "content",
  },
  testimonials: {
    id: "testimonials",
    label: adminTr.nav.testimonials,
    href: ADMIN_ROUTES.testimonials,
    description: adminTr.testimonials.description,
    icon: MessageSquareQuote,
    section: "content",
  },
  blog: {
    id: "blog",
    label: adminTr.nav.blog,
    href: ADMIN_ROUTES.blog,
    description: adminTr.blog.description,
    icon: BookOpen,
    section: "content",
  },
  contact: {
    id: "contact",
    label: adminTr.nav.contact,
    href: ADMIN_ROUTES.contact,
    description: adminTr.contact.description,
    icon: Mail,
    section: "content",
  },
  footer: {
    id: "footer",
    label: adminTr.nav.footer,
    href: ADMIN_ROUTES.footer,
    description: adminTr.footer.description,
    icon: PanelBottom,
    section: "pages",
  },
  skills: {
    id: "skills",
    label: adminTr.nav.skills,
    href: ADMIN_ROUTES.skills,
    description: adminTr.skills.description,
    icon: Wrench,
    section: "pages",
  },
  resume: {
    id: "resume",
    label: adminTr.nav.resume,
    href: ADMIN_ROUTES.resume,
    description: adminTr.resume.description,
    icon: FileText,
    section: "pages",
  },
  media: {
    id: "media",
    label: adminTr.nav.media,
    href: ADMIN_ROUTES.media,
    description: adminTr.media.libraryDesc,
    icon: Image,
    section: "system",
  },
  seo: {
    id: "seo",
    label: adminTr.nav.seo,
    href: ADMIN_ROUTES.seo,
    description: adminTr.seo.overview.desc,
    icon: Search,
    section: "system",
  },
  settings: {
    id: "settings",
    label: adminTr.nav.settings,
    href: ADMIN_ROUTES.settings,
    description: adminTr.settings.description,
    icon: Settings,
    section: "system",
  },
  users: {
    id: "users",
    label: adminTr.nav.users,
    href: ADMIN_ROUTES.users,
    description: adminTr.users.description,
    icon: Users,
    section: "system",
  },
};

const MAIN_NAV_IDS = ["dashboard"] as const;
const PAGES_NAV_IDS = ["footer", "skills", "resume"] as const;
const SYSTEM_NAV_IDS = ["media", "seo", "settings", "users"] as const;

function resolveNavItem(id: string): AdminNavigationItem {
  const item = ADMIN_NAV_ITEMS[id];

  if (!item) {
    throw new Error(`Unknown admin navigation item: ${id}`);
  }

  return item;
}

/** Sidebar order mirrors homepage section order, then site pages, then system tools. */
export const adminNavigation: readonly AdminNavigationItem[] = [
  ...MAIN_NAV_IDS.map(resolveNavItem),
  ...ONE_PAGE_SECTION_IDS.map((sectionId) =>
    resolveNavItem(HOME_SECTION_ADMIN_NAV_IDS[sectionId]),
  ),
  ...PAGES_NAV_IDS.map(resolveNavItem),
  ...SYSTEM_NAV_IDS.map(resolveNavItem),
] as const;

export const adminQuickActions = [
  {
    id: "edit-hero",
    label: adminTr.quickActions.editHero.label,
    href: ADMIN_ROUTES.hero,
    description: adminTr.quickActions.editHero.description,
  },
  {
    id: "add-project",
    label: adminTr.quickActions.addProject.label,
    href: ADMIN_ROUTES.projects,
    description: adminTr.quickActions.addProject.description,
  },
  {
    id: "write-blog",
    label: adminTr.quickActions.writeBlog.label,
    href: ADMIN_ROUTES.blog,
    description: adminTr.quickActions.writeBlog.description,
  },
  {
    id: "update-resume",
    label: adminTr.quickActions.updateResume.label,
    href: ADMIN_ROUTES.resume,
    description: adminTr.quickActions.updateResume.description,
  },
  {
    id: "upload-media",
    label: adminTr.quickActions.uploadMedia.label,
    href: ADMIN_ROUTES.media,
    description: adminTr.quickActions.uploadMedia.description,
  },
] as const;
