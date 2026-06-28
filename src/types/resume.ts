import type { EmploymentDate } from "@/types/experience";

export type ResumeFileLocale = "en" | "tr" | "default";

export interface ResumeFile {
  id: string;
  locale: ResumeFileLocale;
  label: string;
  filePath: string;
  fileName: string;
  mimeType: "application/pdf";
  isDefault?: boolean;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: EmploymentDate;
  endDate?: EmploymentDate;
  description?: string;
}

export interface ResumeCertification {
  id: string;
  title: string;
  organization: string;
  issueDate?: EmploymentDate;
  credentialUrl?: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  proficiency: string;
}

export interface ResumeQuickFact {
  id: string;
  label: string;
  value: string;
}

export interface ResumeProfile {
  fullName: string;
  title: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  yearsOfExperience: number;
}

export interface ResumeSectionHeader {
  title: string;
  description: string;
}

export interface ResumeTitledBlock {
  title: string;
}

export interface ResumeExperienceSnapshotConfig {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  entryIds: readonly string[];
}

export interface ResumeSkillsSnapshotConfig {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  itemIds: readonly string[];
}

export interface ResumeActions {
  downloadLabel: string;
  viewLabel: string;
  contactLabel: string;
  contactHref: string;
}

export interface ResumeContent {
  id: string;
  section: ResumeSectionHeader;
  profile: ResumeProfile;
  updatedAt: string;
  professionalSummary: ResumeTitledBlock & {
    paragraphs: readonly string[];
  };
  quickFacts: ResumeTitledBlock & {
    items: readonly ResumeQuickFact[];
  };
  experienceSnapshot: ResumeExperienceSnapshotConfig;
  skillsSnapshot: ResumeSkillsSnapshotConfig;
  education: ResumeTitledBlock & {
    items: readonly ResumeEducation[];
  };
  certifications: ResumeTitledBlock & {
    items: readonly ResumeCertification[];
  };
  languages: ResumeTitledBlock & {
    items: readonly ResumeLanguage[];
  };
  files: readonly ResumeFile[];
  actions: ResumeActions;
}

/** Prepared for future ProfilePage / Resume JSON-LD generation. */
export interface ResumeStructuredDataInput {
  fullName: string;
  title: string;
  email: string;
  url: string;
  linkedin: string;
  github: string;
  summary: string;
  location: string;
  yearsOfExperience: number;
  updatedAt: string;
  skills: readonly string[];
  languages: readonly string[];
  workHistory: readonly {
    position: string;
    company: string;
    period: string;
    summary: string;
  }[];
}
