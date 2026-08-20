import { projectsContent } from "@/data/projects.data";
import type { ProjectsContent } from "@/types/project";

export function normalizeProjectsContent(
  content: Partial<ProjectsContent> | null | undefined,
): ProjectsContent {
  if (!content) {
    return projectsContent;
  }

  return {
    hero: content.hero ?? projectsContent.hero,
    featured: content.featured ?? projectsContent.featured,
    grid: content.grid ?? projectsContent.grid,
    cta: content.cta ?? projectsContent.cta,
    visible: content.visible ?? projectsContent.visible,
    filters: content.filters ?? projectsContent.filters,
    home: content.home ?? projectsContent.home,
    entries:
      content.entries && content.entries.length > 0
        ? content.entries
        : projectsContent.entries,
  };
}
