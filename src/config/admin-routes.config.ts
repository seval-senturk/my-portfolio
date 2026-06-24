export const ADMIN_ROUTES = {
  root: "/admin",
  login: "/admin/login",
  unauthorized: "/admin/unauthorized",
  dashboard: "/admin/dashboard",
  projects: "/admin/projects",
  experience: "/admin/experience",
  skills: "/admin/skills",
  resume: "/admin/resume",
  blog: "/admin/blog",
  contact: "/admin/contact",
  settings: "/admin/settings",
} as const;

export type AdminRouteKey = keyof typeof ADMIN_ROUTES;
