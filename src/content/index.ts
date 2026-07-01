export {
  assertRequired,
  buildCloudinaryUrl,
  createMediaAsset,
  isValidSlug,
  validateSeoFields,
  validateSlug,
} from "@/content/shared";

export type {
  ContentLocale,
  ContentMeta,
  ContentQueryOptions,
  ContentRepository,
  ContentStatus,
  FooterContent,
  MediaAsset,
  MediaProvider,
  PublishableContent,
  SeoFields,
} from "@/content/shared";

export { aboutHomeContentService } from "@/content/domains/about-home";
export { aboutContentService } from "@/content/domains/about";
export { blogContentService } from "@/content/domains/blog";
export { contactContentService } from "@/content/domains/contact";
export { expertiseCarouselContentService } from "@/content/domains/expertise-carousel";
export { footerContentService } from "@/content/domains/footer";
export { experienceContentService } from "@/content/domains/experience";
export { heroContentService } from "@/content/domains/hero";
export { projectsContentService } from "@/content/domains/projects";
export { resumeContentService } from "@/content/domains/resume";
export { siteContentService } from "@/content/domains/site";
export { skillsContentService } from "@/content/domains/skills";

export type { ContentRepositories } from "@/content/registry";
export { contentRepositories } from "@/content/registry";
