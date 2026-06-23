export const ROUTES = {
  home: "/",
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
  {
    path: ROUTES.home,
    changeFrequency: "weekly",
    priority: 1,
  },
] as const;
