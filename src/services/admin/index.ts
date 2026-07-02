export {
  getDashboardStats,
  getRecentContent,
  buildContentDistribution,
  buildSiteVisitSeries,
  computeStatTrend,
} from "@/services/admin/dashboard.service";
export type {
  DashboardStats,
  RecentContentItem,
  ContentDistributionSlice,
  SiteVisitPoint,
} from "@/services/admin/dashboard.service";

export {
  getAboutRecord,
  serializeAboutForForm,
  serializeAboutContentForForm,
  updateAbout,
} from "@/services/admin/about.admin.service";
export type { UpdateAboutInput } from "@/services/admin/about.admin.service";

export { getHeroRecord, updateHero } from "@/services/admin/hero.admin.service";
export type { UpdateHeroInput } from "@/services/admin/hero.admin.service";

export {
  getSocialLinksForAdmin,
  replaceSocialLinks,
} from "@/services/admin/social.admin.service";

export {
  createExperienceEntry,
  deleteExperienceEntry,
  getExperiencePageConfig,
  listExperienceEntries,
  reorderExperienceEntries,
  updateExperienceEntry,
  updateExperiencePageConfig,
} from "@/services/admin/experience.admin.service";
export type {
  ExperienceEntryInput,
  ExperiencePageConfigInput,
} from "@/services/admin/experience.admin.service";

export {
  createEducationHomeEntry,
  deleteEducationHomeEntry,
  getEducationHomeConfig,
  listEducationHomeEntries,
  reorderEducationHomeEntries,
  updateEducationHomeConfig,
  updateEducationHomeEntry,
} from "@/services/admin/education-home.admin.service";
export type {
  EducationHomeConfigInput,
  EducationHomeEntryInput,
} from "@/services/admin/education-home.admin.service";

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
  createExpertiseCarouselItem,
  deleteExpertiseCarouselItem,
  getExpertiseCarouselConfig,
  listExpertiseCarouselItems,
  parseExpertiseBulletList,
  reorderExpertiseCarouselItems,
  updateExpertiseCarouselConfig,
  updateExpertiseCarouselItem,
} from "@/services/admin/expertise-carousel.admin.service";

export {
  getFooterConfig,
  updateFooterConfig,
} from "@/services/admin/footer.admin.service";

export {
  getAboutHomeConfig,
  listAboutHomeQuickInfo,
  listAboutHomeStats,
  updateAboutHomeConfig,
  createAboutHomeQuickInfo,
  updateAboutHomeQuickInfo,
  deleteAboutHomeQuickInfo,
  reorderAboutHomeQuickInfo,
  createAboutHomeStat,
  updateAboutHomeStat,
  deleteAboutHomeStat,
  reorderAboutHomeStats,
} from "@/services/admin/about-home.admin.service";

export {
  getResumeRecord,
  serializeResumeForForm,
  serializeResumeFile,
  updateResume,
  upsertDefaultResumePdf,
} from "@/services/admin/resume.admin.service";
export type { ResumeFileInfo, UpdateResumeInput } from "@/services/admin/resume.admin.service";

export {
  listBlogPostsAdmin,
  getBlogPostAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  serializeBlogPostForForm,
} from "@/services/admin/blog.admin.service";
export type { BlogPostInput, BlogSeoInput } from "@/services/admin/blog.admin.service";

export {
  listBlogCategoriesAdmin,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/services/admin/blog-category.admin.service";

export {
  listBlogTagsAdmin,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag,
} from "@/services/admin/blog-tag.admin.service";
