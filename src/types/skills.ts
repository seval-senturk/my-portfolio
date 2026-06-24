export type ProficiencyLevel =
  | "Advanced"
  | "Experienced"
  | "Proficient"
  | "Working Knowledge";

export type SkillCategory =
  | "Frontend Development"
  | "Backend Development"
  | "Databases"
  | "AI & Integrations"
  | "Tools & Workflow";

export interface SkillEntry {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  featured?: boolean;
  yearsOfExperience?: number;
  proficiencyLevel?: ProficiencyLevel;
}

export interface FeaturedExpertiseEntry {
  id: string;
  title: string;
  description: string;
}

export interface SkillsSectionHeader {
  title: string;
  description: string;
}

export interface SkillsSubsectionHeader {
  title: string;
}

export interface SkillCategoryGroup {
  category: SkillCategory;
  skills: SkillEntry[];
}

export interface SkillsContent {
  section: SkillsSectionHeader;
  featuredExpertise: {
    header: SkillsSubsectionHeader;
    items: readonly FeaturedExpertiseEntry[];
  };
  categories: {
    header: SkillsSubsectionHeader;
  };
  entries: readonly SkillEntry[];
}
