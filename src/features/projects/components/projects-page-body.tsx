"use client";

import { useMemo, useState } from "react";

import type { ProjectEntry, ProjectFilterItem, ProjectsContent } from "@/types/project";
import { matchesProjectFilter, partitionFeaturedProjects } from "@/lib/projects/format";
import { ProjectGridCard } from "@/features/projects/components/project-grid-card";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { ProjectsFilterBar } from "@/features/projects/components/projects-filter-bar";
import { ProjectsPageCta } from "@/features/projects/components/projects-page-cta";
import { cn } from "@/lib/cn";

interface ProjectsPageBodyProps {
  content: ProjectsContent;
}

function filterGridProjects(
  projects: readonly ProjectEntry[],
  activeFilter: string,
  filters: readonly ProjectFilterItem[],
): ProjectEntry[] {
  if (activeFilter === "all") {
    return [...projects];
  }

  const filter = filters.find((item) => item.slug === activeFilter);
  if (!filter) {
    return [...projects];
  }

  return projects.filter((project) => matchesProjectFilter(project, filter));
}

export function ProjectsPageBody({ content }: ProjectsPageBodyProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const { featured, grid } = useMemo(
    () => partitionFeaturedProjects(content.entries),
    [content.entries],
  );

  const filteredGrid = useMemo(
    () => filterGridProjects(grid, activeFilter, content.filters),
    [grid, activeFilter, content.filters],
  );

  return (
    <>
      <ProjectsFilterBar
        filters={content.filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {featured.length > 0 ? (
        <section className="projects-page__featured" aria-labelledby="projects-featured-heading">
          <h2 id="projects-featured-heading" className="projects-page__section-title">
            {content.featured.title}
          </h2>
          <div className="projects-page__featured-list">
            {featured.map((project, index) => (
              <ProjectShowcaseCard
                key={project.id}
                project={project}
                reversed={index % 2 === 1}
                priorityImage={index === 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="projects-page__grid-section" aria-labelledby="projects-grid-heading">
        <h2 id="projects-grid-heading" className="projects-page__section-title">
          {content.grid.title}
        </h2>

        <div
          className={cn(
            "projects-page__grid",
            filteredGrid.length === 0 && "projects-page__grid--empty",
          )}
        >
          {filteredGrid.length > 0 ? (
            filteredGrid.map((project, index) => (
              <ProjectGridCard key={project.id} project={project} priorityImage={index < 3} />
            ))
          ) : (
            <p className="projects-page__empty">No projects match this filter yet.</p>
          )}
        </div>
      </section>

      {content.cta.visible ? <ProjectsPageCta cta={content.cta} /> : null}
    </>
  );
}
