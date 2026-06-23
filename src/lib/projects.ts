import { ROUTES } from "@/constants/routes";
import type { ProjectEntry } from "@/types/project";

export function getProjectDetailPath(slug: string): string {
  return `${ROUTES.projects}/${slug}`;
}

export function partitionFeaturedProjects(
  entries: readonly ProjectEntry[],
): {
  featured: ProjectEntry[];
  additional: ProjectEntry[];
} {
  const featured: ProjectEntry[] = [];
  const additional: ProjectEntry[] = [];

  for (const entry of entries) {
    if (entry.featured) {
      featured.push(entry);
    } else {
      additional.push(entry);
    }
  }

  return { featured, additional };
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
