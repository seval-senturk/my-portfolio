import { cache } from "react";

import {
  aboutContentService,
  aboutHomeContentService,
  blogContentService,
  contactContentService,
  educationHomeContentService,
  experienceContentService,
  expertiseCarouselContentService,
  footerContentService,
  heroContentService,
  projectsContentService,
  resumeContentService,
  siteContentService,
  skillsContentService,
} from "@/content";

/** Dedupes identical content reads within a single RSC request (metadata + page). */
export const requestHeroContent = cache(() => heroContentService.get());
export const requestAboutContent = cache(() => aboutContentService.get());
export const requestAboutHomeContent = cache(() => aboutHomeContentService.get());
export const requestEducationHomeContent = cache(() => educationHomeContentService.get());
export const requestExperienceContent = cache(() => experienceContentService.get());
export const requestExpertiseCarouselContent = cache(() =>
  expertiseCarouselContentService.get(),
);
export const requestProjectsContent = cache(() => projectsContentService.get());
export const requestSkillsContent = cache(() => skillsContentService.get());
export const requestResumeContent = cache(() => resumeContentService.get());
export const requestContactContent = cache(() => contactContentService.get());
export const requestBlogContent = cache(() => blogContentService.get());
export const requestSiteHighlights = cache(() =>
  siteContentService.getProfessionalHighlights(),
);
export const requestSiteFooter = cache(() => footerContentService.get());
export const requestSiteSocialLinks = cache(() =>
  siteContentService.getSocialLinks(),
);

export const requestBlogPostBySlug = cache((slug: string) =>
  blogContentService.getPostBySlug(slug),
);
