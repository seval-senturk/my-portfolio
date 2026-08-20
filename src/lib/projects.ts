import { ROUTES } from "@/constants/routes";
import type { ProjectEntry } from "@/types/project";

export {
  getProjectYearLabel,
  matchesProjectFilter,
  partitionFeaturedProjects,
} from "@/lib/projects/format";

export function getProjectDetailPath(slug: string): string {
  return `${ROUTES.projects}/${slug}`;
}

export function getProjectAnchorPath(slug: string): string {
  return getProjectDetailPath(slug);
}

export function getProjectBySlug(
  entries: readonly ProjectEntry[],
  slug: string,
): ProjectEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

export function getProjectsByCategory(
  entries: readonly ProjectEntry[],
  category: ProjectEntry["category"],
): ProjectEntry[] {
  return entries.filter((entry) => entry.category === category);
}
