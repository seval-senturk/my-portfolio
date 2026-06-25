import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Image,
  LayoutDashboard,
  Mail,
  Search,
  Settings,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";

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
    label: "Dashboard",
    href: ADMIN_ROUTES.dashboard,
    description: "Overview and quick actions",
    icon: LayoutDashboard,
    section: "main",
  },
  {
    id: "hero",
    label: "Hero",
    href: ADMIN_ROUTES.hero,
    description: "Homepage hero section",
    icon: Sparkles,
    section: "content",
  },
  {
    id: "about",
    label: "About",
    href: ADMIN_ROUTES.about,
    description: "About page content",
    icon: User,
    section: "content",
  },
  {
    id: "experience",
    label: "Experience",
    href: ADMIN_ROUTES.experience,
    description: "Work history entries",
    icon: Briefcase,
    section: "content",
  },
  {
    id: "projects",
    label: "Projects",
    href: ADMIN_ROUTES.projects,
    description: "Project showcase",
    icon: FolderKanban,
    section: "content",
  },
  {
    id: "skills",
    label: "Skills",
    href: ADMIN_ROUTES.skills,
    description: "Skills and expertise",
    icon: Wrench,
    section: "content",
  },
  {
    id: "resume",
    label: "Resume",
    href: ADMIN_ROUTES.resume,
    description: "Resume center content",
    icon: FileText,
    section: "content",
  },
  {
    id: "blog",
    label: "Blog",
    href: ADMIN_ROUTES.blog,
    description: "Blog posts and categories",
    icon: BookOpen,
    section: "content",
  },
  {
    id: "contact",
    label: "Contact Messages",
    href: ADMIN_ROUTES.contact,
    description: "Inbound contact leads",
    icon: Mail,
    section: "content",
  },
  {
    id: "media",
    label: "Media",
    href: ADMIN_ROUTES.media,
    description: "Media library (coming soon)",
    icon: Image,
    section: "system",
  },
  {
    id: "seo",
    label: "SEO",
    href: ADMIN_ROUTES.seo,
    description: "SEO metadata management",
    icon: Search,
    section: "system",
  },
  {
    id: "settings",
    label: "Settings",
    href: ADMIN_ROUTES.settings,
    description: "Site configuration",
    icon: Settings,
    section: "system",
  },
] as const;

export const adminQuickActions = [
  {
    id: "add-project",
    label: "Add Project",
    href: ADMIN_ROUTES.projects,
    description: "Create a new project entry",
  },
  {
    id: "write-blog",
    label: "Write Blog",
    href: ADMIN_ROUTES.blog,
    description: "Draft a new blog post",
  },
  {
    id: "update-resume",
    label: "Update Resume",
    href: ADMIN_ROUTES.resume,
    description: "Edit resume content",
  },
  {
    id: "edit-hero",
    label: "Edit Hero",
    href: ADMIN_ROUTES.hero,
    description: "Update homepage hero",
  },
  {
    id: "upload-media",
    label: "Upload Image",
    href: ADMIN_ROUTES.media,
    description: "Manage media assets",
  },
] as const;
