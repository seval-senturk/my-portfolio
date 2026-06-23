export const ROUTES = {
  home: "/",
  about: "/about",
  experience: "/experience",
  projects: "/projects",
  skills: "/skills",
  contact: "/contact",
  resume: "/resume",
} as const;

export type RouteKey = keyof typeof ROUTES;

export interface SitemapRoute {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export const SITEMAP_ROUTES: readonly SitemapRoute[] = [
  { path: ROUTES.home, changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.about, changeFrequency: "monthly", priority: 0.8 },
  { path: ROUTES.experience, changeFrequency: "monthly", priority: 0.9 },
  { path: ROUTES.projects, changeFrequency: "weekly", priority: 0.9 },
  { path: ROUTES.skills, changeFrequency: "monthly", priority: 0.7 },
  { path: ROUTES.contact, changeFrequency: "yearly", priority: 0.6 },
  { path: ROUTES.resume, changeFrequency: "monthly", priority: 0.9 },
] as const;
