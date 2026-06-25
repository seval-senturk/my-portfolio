import { ROUTES } from "@/constants/routes";

export const SEO_ENTITY_TYPES = {
  BLOG_POST: "blog_post",
  PROJECT: "project",
  RESUME: "resume",
  AI_CAREER: "ai_career",
} as const;

export type SeoEntityType =
  (typeof SEO_ENTITY_TYPES)[keyof typeof SEO_ENTITY_TYPES];

export const SEO_PAGE_KEYS = {
  HOME: "home",
  ABOUT: "about",
  EXPERIENCE: "experience",
  PROJECTS: "projects",
  SKILLS: "skills",
  RESUME: "resume",
  CONTACT: "contact",
  BLOG: "blog",
  AI_CAREER: "ai_career",
} as const;

export type SeoPageKey = (typeof SEO_PAGE_KEYS)[keyof typeof SEO_PAGE_KEYS];

export interface SeoPageDefinition {
  pageKey: SeoPageKey;
  label: string;
  routePath: string;
}

export const SEO_PAGE_DEFINITIONS: readonly SeoPageDefinition[] = [
  { pageKey: SEO_PAGE_KEYS.HOME, label: "Home", routePath: ROUTES.home },
  { pageKey: SEO_PAGE_KEYS.ABOUT, label: "About", routePath: ROUTES.about },
  {
    pageKey: SEO_PAGE_KEYS.EXPERIENCE,
    label: "Experience",
    routePath: ROUTES.experience,
  },
  {
    pageKey: SEO_PAGE_KEYS.PROJECTS,
    label: "Projects",
    routePath: ROUTES.projects,
  },
  { pageKey: SEO_PAGE_KEYS.SKILLS, label: "Skills", routePath: ROUTES.skills },
  { pageKey: SEO_PAGE_KEYS.RESUME, label: "Resume", routePath: ROUTES.resume },
  {
    pageKey: SEO_PAGE_KEYS.CONTACT,
    label: "Contact",
    routePath: ROUTES.contact,
  },
  { pageKey: SEO_PAGE_KEYS.BLOG, label: "Blog", routePath: ROUTES.blog },
  {
    pageKey: SEO_PAGE_KEYS.AI_CAREER,
    label: "AI Career",
    routePath: "/career",
  },
] as const;

export const STRUCTURED_DATA_SCHEMA_TYPES = [
  "Person",
  "WebSite",
  "Organization",
  "ProfilePage",
  "BlogPosting",
  "BreadcrumbList",
  "Article",
  "FAQPage",
  "WebPage",
] as const;

export type StructuredDataSchemaType =
  (typeof STRUCTURED_DATA_SCHEMA_TYPES)[number];
