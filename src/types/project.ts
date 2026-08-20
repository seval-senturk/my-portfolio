import type { EmploymentDate } from "@/types/experience";

export type ProjectCategory =
  | "Frontend"
  | "Full Stack"
  | "AI"
  | "SaaS"
  | "CMS"
  | "E-Commerce";

export type ProjectStatus = "Live" | "In Progress" | "Private" | "Archived";

export type ProjectType = "Commercial" | "Personal" | "Open Source";

export type ProjectFilterMatchType = "category" | "projectType";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  technologies: readonly string[];
  challenges: readonly string[];
  results: readonly string[];
}

export interface ProjectEntry {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: ProjectCategory;
  status?: ProjectStatus;
  client?: string;
  role: string;
  projectType?: ProjectType;
  technologies: readonly string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  visible?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  gallery?: readonly string[];
  startDate?: EmploymentDate;
  endDate?: EmploymentDate;
  publishedAt?: string;
  highlights?: readonly string[];
  caseStudy?: ProjectCaseStudy;
  metrics?: readonly ProjectMetric[];
}

export interface ProjectsPageHero {
  label: string;
  title: string;
  titleAccent?: string;
  description: string;
}

export interface ProjectsSubsectionHeader {
  title: string;
}

export interface ProjectsPageCta {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  visible: boolean;
}

export interface ProjectFilterItem {
  id: string;
  label: string;
  slug: string;
  matchType: ProjectFilterMatchType;
  matchValue: string;
  visible: boolean;
  sortOrder: number;
}

export interface ProjectsHomeSection {
  visible: boolean;
  label: string;
  title: string;
  titleAccent?: string;
  description?: string;
  featuredLimit: number;
  ctaLabel: string;
  ctaHref: string;
}

export interface ProjectsContent {
  hero: ProjectsPageHero;
  home: ProjectsHomeSection;
  featured: ProjectsSubsectionHeader;
  grid: ProjectsSubsectionHeader;
  cta: ProjectsPageCta;
  filters: readonly ProjectFilterItem[];
  visible: boolean;
  entries: readonly ProjectEntry[];
}

/** @deprecated Use ProjectsContent.hero */
export interface ProjectsSectionHeader {
  title: string;
  description: string;
}
