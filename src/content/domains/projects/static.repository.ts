import { projectsContent } from "@/data/projects.data";
import { getProjectBySlug, getProjectsByCategory } from "@/lib/projects";

import type { ProjectsRepository } from "@/content/domains/projects/repository";

export const staticProjectsRepository: ProjectsRepository = {
  async get() {
    return projectsContent;
  },

  async getBySlug(slug) {
    return getProjectBySlug(projectsContent.entries, slug) ?? null;
  },

  async getByCategory(category) {
    return getProjectsByCategory(projectsContent.entries, category);
  },
};
