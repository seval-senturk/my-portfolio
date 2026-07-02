export interface EducationHomeDate {
  month?: number;
  year: number;
}

export interface EducationHomeEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  levelBadge?: string;
  startDate?: EducationHomeDate;
  endDate?: EducationHomeDate;
  description: string;
  technologies: readonly string[];
  visible?: boolean;
}

export interface EducationHomeSectionHeader {
  label: string;
  title: string;
  description?: string;
  visible: boolean;
}

export interface EducationHomeContent {
  section: EducationHomeSectionHeader;
  entries: readonly EducationHomeEntry[];
}
