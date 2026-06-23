import type { EmploymentDate } from "@/types/experience";

export type ProjectCategory =
  | "Frontend"
  | "Full Stack"
  | "AI"
  | "SaaS"
  | "CMS"
  | "E-Commerce";

export type ProjectStatus = "Live" | "In Progress" | "Private" | "Archived";

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
  technologies: readonly string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  coverImage?: string;
  gallery?: readonly string[];
  startDate?: EmploymentDate;
  endDate?: EmploymentDate;
  highlights?: readonly string[];
  caseStudy?: ProjectCaseStudy;
  metrics?: readonly ProjectMetric[];
}

export interface ProjectsSectionHeader {
  title: string;
  description: string;
}

export interface ProjectsSubsectionHeader {
  title: string;
}

export interface ProjectsContent {
  section: ProjectsSectionHeader;
  featured: ProjectsSubsectionHeader;
  additional: ProjectsSubsectionHeader;
  entries: readonly ProjectEntry[];
}
