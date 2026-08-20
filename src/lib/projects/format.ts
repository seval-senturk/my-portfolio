import type { ProjectEntry } from "@/types/project";

export function getProjectYearLabel(
  project: Pick<ProjectEntry, "startDate" | "endDate" | "publishedAt">,
): string | null {
  if (project.publishedAt) {
    const year = new Date(project.publishedAt).getFullYear();
    return Number.isNaN(year) ? null : String(year);
  }

  if (project.startDate?.year) {
    const end = project.endDate?.year ?? "Present";
    return `${project.startDate.year}${project.endDate ? `–${end}` : ""}`;
  }

  return null;
}

export function matchesProjectFilter(
  project: ProjectEntry,
  filter: { matchType: "category" | "projectType"; matchValue: string },
): boolean {
  if (filter.matchType === "category") {
    return project.category === filter.matchValue;
  }

  return project.projectType === filter.matchValue;
}

export function partitionFeaturedProjects(
  entries: readonly ProjectEntry[],
  limit = 3,
): {
  featured: ProjectEntry[];
  grid: ProjectEntry[];
} {
  const featured = entries.filter((entry) => entry.featured).slice(0, limit);
  const featuredIds = new Set(featured.map((entry) => entry.id));
  const grid = entries.filter((entry) => !featuredIds.has(entry.id));

  return { featured, grid };
}
