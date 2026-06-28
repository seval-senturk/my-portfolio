import { ROUTES } from "@/constants/routes";
import { SEO_PAGE_DEFINITIONS } from "@/constants/seo-pages";

/** Public routes that have a corresponding page under `app/(site)/`. */
export const PUBLIC_SITE_ROUTE_PATHS = new Set<string>([
  ROUTES.home,
  ROUTES.about,
  ROUTES.experience,
  ROUTES.projects,
  ROUTES.skills,
  ROUTES.resume,
  ROUTES.contact,
  ROUTES.blog,
]);

export function isPublicSiteRoute(routePath: string): boolean {
  return PUBLIC_SITE_ROUTE_PATHS.has(routePath);
}

export const INDEXABLE_STATIC_SEO_PAGES = SEO_PAGE_DEFINITIONS.filter((page) =>
  isPublicSiteRoute(page.routePath),
);
