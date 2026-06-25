export { getDashboardStats } from "@/services/admin/dashboard.service";
export type { DashboardStats } from "@/services/admin/dashboard.service";

export {
  getAboutRecord,
  serializeAboutForForm,
  updateAbout,
} from "@/services/admin/about.admin.service";
export type { UpdateAboutInput } from "@/services/admin/about.admin.service";

export { getHeroRecord, updateHero } from "@/services/admin/hero.admin.service";
export type { UpdateHeroInput } from "@/services/admin/hero.admin.service";

export {
  createExperienceEntry,
  deleteExperienceEntry,
  listExperienceEntries,
  updateExperienceEntry,
} from "@/services/admin/experience.admin.service";
export type { ExperienceEntryInput } from "@/services/admin/experience.admin.service";

export {
  createProjectEntry,
  deleteProjectEntry,
  listProjectEntries,
  parseCommaList,
  parseMultilineList,
  updateProjectEntry,
} from "@/services/admin/project.admin.service";
export type { ProjectEntryInput } from "@/services/admin/project.admin.service";

export {
  createSkillEntry,
  deleteSkillEntry,
  listSkillEntries,
  updateSkillEntry,
} from "@/services/admin/skill.admin.service";
export type { SkillEntryInput } from "@/services/admin/skill.admin.service";

export {
  getResumeRecord,
  serializeResumeForForm,
  updateResume,
} from "@/services/admin/resume.admin.service";
export type { UpdateResumeInput } from "@/services/admin/resume.admin.service";
