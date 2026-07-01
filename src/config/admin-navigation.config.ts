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
  PanelBottom,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  Wrench,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { adminTr } from "@/features/admin/i18n/tr";

export interface AdminNavigationItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon: LucideIcon;
  section?: "main" | "content" | "system";
}

export const adminNavigation: readonly AdminNavigationItem[] = [
  {
    id: "dashboard",
    label: adminTr.nav.dashboard,
    href: ADMIN_ROUTES.dashboard,
    description: adminTr.dashboard.description,
    icon: LayoutDashboard,
    section: "main",
  },
  {
    id: "hero",
    label: adminTr.nav.hero,
    href: ADMIN_ROUTES.hero,
    description: adminTr.hero.description,
    icon: Sparkles,
    section: "content",
  },
  {
    id: "about",
    label: adminTr.nav.about,
    href: ADMIN_ROUTES.about,
    description: adminTr.about.description,
    icon: User,
    section: "content",
  },
  {
    id: "expertise-carousel",
    label: adminTr.nav.expertiseCarousel,
    href: ADMIN_ROUTES.expertiseCarousel,
    description: adminTr.expertiseCarousel.description,
    icon: LayoutGrid,
    section: "content",
  },
  {
    id: "footer",
    label: adminTr.nav.footer,
    href: ADMIN_ROUTES.footer,
    description: adminTr.footer.description,
    icon: PanelBottom,
    section: "content",
  },
  {
    id: "experience",
    label: adminTr.nav.experience,
    href: ADMIN_ROUTES.experience,
    description: adminTr.experience.description,
    icon: Briefcase,
    section: "content",
  },
  {
    id: "projects",
    label: adminTr.nav.projects,
    href: ADMIN_ROUTES.projects,
    description: adminTr.projects.description,
    icon: FolderKanban,
    section: "content",
  },
  {
    id: "skills",
    label: adminTr.nav.skills,
    href: ADMIN_ROUTES.skills,
    description: adminTr.skills.description,
    icon: Wrench,
    section: "content",
  },
  {
    id: "resume",
    label: adminTr.nav.resume,
    href: ADMIN_ROUTES.resume,
    description: adminTr.resume.description,
    icon: FileText,
    section: "content",
  },
  {
    id: "blog",
    label: adminTr.nav.blog,
    href: ADMIN_ROUTES.blog,
    description: adminTr.blog.description,
    icon: BookOpen,
    section: "content",
  },
  {
    id: "contact",
    label: adminTr.nav.contact,
    href: ADMIN_ROUTES.contact,
    description: adminTr.contact.description,
    icon: Mail,
    section: "content",
  },
  {
    id: "media",
    label: adminTr.nav.media,
    href: ADMIN_ROUTES.media,
    description: adminTr.media.libraryDesc,
    icon: Image,
    section: "system",
  },
  {
    id: "seo",
    label: adminTr.nav.seo,
    href: ADMIN_ROUTES.seo,
    description: adminTr.seo.overview.desc,
    icon: Search,
    section: "system",
  },
  {
    id: "settings",
    label: adminTr.nav.settings,
    href: ADMIN_ROUTES.settings,
    description: adminTr.settings.description,
    icon: Settings,
    section: "system",
  },
  {
    id: "users",
    label: adminTr.nav.users,
    href: ADMIN_ROUTES.users,
    description: adminTr.users.description,
    icon: Users,
    section: "system",
  },
] as const;

export const adminQuickActions = [
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
    id: "edit-hero",
    label: adminTr.quickActions.editHero.label,
    href: ADMIN_ROUTES.hero,
    description: adminTr.quickActions.editHero.description,
  },
  {
    id: "upload-media",
    label: adminTr.quickActions.uploadMedia.label,
    href: ADMIN_ROUTES.media,
    description: adminTr.quickActions.uploadMedia.description,
  },
] as const;
