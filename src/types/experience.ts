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

export interface ExperienceSectionHeader {
  label: string;
  title: string;
  description: string;
  visible: boolean;
  cta: {
    label: string;
    href: string;
    visible: boolean;
  };
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
  visible?: boolean;
}

export interface ExperienceContent {
  section: ExperienceSectionHeader;
  entries: readonly ExperienceEntry[];
}
