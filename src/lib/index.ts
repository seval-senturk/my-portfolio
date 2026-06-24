export { env } from "@/lib/env";
export { absoluteUrl } from "@/lib/url";
export { cn } from "@/lib/cn";
export { isActiveRoute } from "@/lib/navigation";
export { formatEmploymentPeriod, formatMonthYear } from "@/lib/date";
export {
  formatTechnologyList,
  selectStats,
  TECHNOLOGY_LIST_SEPARATOR,
} from "@/lib/content";
export {
  getProjectBySlug,
  getProjectDetailPath,
  getProjectsByCategory,
  partitionFeaturedProjects,
} from "@/lib/projects";
export {
  filterSkillsByQuery,
  getFeaturedSkills,
  getSkillsByCategory,
  groupSkillsByCategory,
  SKILL_CATEGORY_ORDER,
} from "@/lib/skills";
export {
  getDefaultResumeFile,
  getResumeFileByLocale,
  resolveExperienceSnapshot,
  resolveSkillsSnapshot,
  toResumeStructuredDataInput,
} from "@/lib/resume";
export { A11Y, FOCUS_RING_CLASS } from "@/lib/accessibility";
