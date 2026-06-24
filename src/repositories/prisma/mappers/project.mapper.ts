import type { Project, ProjectTechnology, Technology } from "@prisma/client";

import { mapEmploymentDate } from "@/repositories/prisma/mappers/shared.mapper";
import type {
  ProjectCaseStudy,
  ProjectEntry,
  ProjectMetric,
  ProjectsContent,
} from "@/types/project";

type ProjectWithTechnologies = Project & {
  technologies: (ProjectTechnology & { technology: Technology })[];
};

export function mapProjectEntry(project: ProjectWithTechnologies): ProjectEntry {
  const gallery = project.gallery as string[] | null;
  const caseStudy = project.caseStudy as ProjectCaseStudy | null;
  const metrics = project.metrics as ProjectMetric[] | null;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    category: project.category as ProjectEntry["category"],
    status: project.status as ProjectEntry["status"],
    client: project.client ?? undefined,
    role: project.role,
    technologies: project.technologies
      .map((item) => item.technology.name)
      .sort((a, b) => a.localeCompare(b)),
    githubUrl: project.githubUrl ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
    featured: project.featured,
    coverImage: project.coverImageUrl ?? undefined,
    gallery: gallery ?? undefined,
    startDate: mapEmploymentDate(project.startMonth, project.startYear),
    endDate: mapEmploymentDate(project.endMonth, project.endYear),
    highlights: project.highlights,
    caseStudy: caseStudy ?? undefined,
    metrics: metrics ?? undefined,
  };
}

export function mapProjectsToContent(
  config: {
    sectionTitle: string;
    sectionDescription: string;
    featuredTitle: string;
    additionalTitle: string;
  },
  projects: ProjectWithTechnologies[],
): ProjectsContent {
  return {
    section: {
      title: config.sectionTitle,
      description: config.sectionDescription,
    },
    featured: { title: config.featuredTitle },
    additional: { title: config.additionalTitle },
    entries: projects.map(mapProjectEntry),
  };
}
