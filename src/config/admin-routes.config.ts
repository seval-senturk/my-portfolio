export const ADMIN_ROUTES = {
  root: "/admin",
  login: "/admin/login",
  unauthorized: "/admin/unauthorized",
  dashboard: "/admin/dashboard",
  hero: "/admin/hero",
  about: "/admin/about",
  projects: "/admin/projects",
  experience: "/admin/experience",
  skills: "/admin/skills",
  resume: "/admin/resume",
  blog: "/admin/blog",
  contact: "/admin/contact",
  media: "/admin/media",
  seo: "/admin/seo",
  settings: "/admin/settings",
} as const;

export type AdminRouteKey = keyof typeof ADMIN_ROUTES;
