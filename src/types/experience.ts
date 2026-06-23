export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship";

export interface EmploymentDate {
  month: number;
  year: number;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  location: string;
  startDate: EmploymentDate;
  endDate?: EmploymentDate;
  current?: boolean;
  summary: string;
  responsibilities: readonly string[];
  technologies: readonly string[];
  achievements?: readonly string[];
}

export interface ExperienceSectionHeader {
  title: string;
  description: string;
}

export interface ExperienceContent {
  section: ExperienceSectionHeader;
  entries: readonly ExperienceEntry[];
}
