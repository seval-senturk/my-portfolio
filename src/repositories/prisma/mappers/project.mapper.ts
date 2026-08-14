import type { Project, ProjectPageFilter, ProjectTechnology, Technology } from "@prisma/client";

import { mapEmploymentDate } from "@/repositories/prisma/mappers/shared.mapper";
import type {
  ProjectCaseStudy,
  ProjectEntry,
  ProjectFilterItem,
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
    projectType: project.projectType as ProjectEntry["projectType"],
    technologies: project.technologies
      .map((item) => item.technology.name)
      .sort((a, b) => a.localeCompare(b)),
    githubUrl: project.githubUrl ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
    featured: project.featured,
    visible: project.visible,
    coverImage: project.coverImageUrl ?? undefined,
    coverImageAlt: project.coverImageAlt ?? undefined,
    gallery: gallery ?? undefined,
    startDate: mapEmploymentDate(project.startMonth, project.startYear),
    endDate: mapEmploymentDate(project.endMonth, project.endYear),
    publishedAt: project.publishedAt?.toISOString(),
    highlights: project.highlights,
    caseStudy: caseStudy ?? undefined,
    metrics: metrics ?? undefined,
  };
}

export function mapProjectPageFilter(filter: ProjectPageFilter): ProjectFilterItem {
  return {
    id: filter.id,
    label: filter.label,
    slug: filter.slug,
    matchType: filter.matchType as ProjectFilterItem["matchType"],
    matchValue: filter.matchValue,
    visible: filter.visible,
    sortOrder: filter.sortOrder,
  };
}

export function mapProjectsToContent(
  config: {
    label: string;
    sectionTitle: string;
    titleAccent: string | null;
    sectionDescription: string;
    featuredTitle: string;
    additionalTitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel: string;
    ctaButtonHref: string;
    ctaVisible: boolean;
    sectionVisible: boolean;
    homeSectionVisible?: boolean;
    homeFeaturedLimit?: number;
    homeSectionDescription?: string | null;
    homeCtaLabel?: string;
    homeCtaHref?: string;
  },
  filters: ProjectPageFilter[],
  projects: ProjectWithTechnologies[],
): ProjectsContent {
  return {
    hero: {
      label: config.label,
      title: config.sectionTitle,
      titleAccent: config.titleAccent ?? undefined,
      description: config.sectionDescription,
    },
    featured: { title: config.featuredTitle },
    grid: { title: config.additionalTitle },
    cta: {
      title: config.ctaTitle,
      description: config.ctaDescription,
      buttonLabel: config.ctaButtonLabel,
      buttonHref: config.ctaButtonHref,
      visible: config.ctaVisible,
    },
    visible: config.sectionVisible,
    home: {
      visible: config.homeSectionVisible ?? true,
      label: config.label,
      title: config.featuredTitle,
      titleAccent: config.titleAccent ?? undefined,
      description: config.homeSectionDescription ?? undefined,
      featuredLimit: config.homeFeaturedLimit ?? 3,
      ctaLabel: config.homeCtaLabel ?? "View All Projects",
      ctaHref: config.homeCtaHref ?? "/projects",
    },
    filters: filters
      .filter((item) => item.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapProjectPageFilter),
    entries: projects.map(mapProjectEntry),
  };
}
