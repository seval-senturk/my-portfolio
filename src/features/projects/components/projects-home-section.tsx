import Link from "next/link";

import type { ProjectsContent } from "@/types/project";
import { HomeSectionShell } from "@/components/sections";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { normalizeProjectsContent } from "@/lib/projects/normalize";
import { partitionFeaturedProjects } from "@/lib/projects/format";

interface ProjectsHomeSectionProps {
  content: ProjectsContent;
}

export function ProjectsHomeSection({ content }: ProjectsHomeSectionProps) {
  const resolved = normalizeProjectsContent(content);
  const { home, entries } = resolved;

  if (!home.visible) {
    return null;
  }

  const { featured } = partitionFeaturedProjects(entries, home.featuredLimit);

  if (featured.length === 0) {
    return null;
  }

  const headingId = "projects-home-section-heading";

  return (
    <HomeSectionShell
      id="projects"
      headingId={headingId}
      header={{
        label: home.label,
        title: home.title,
        titleAccent: home.titleAccent,
        description: home.description,
        descriptionClassName: "home-section-header__description--muted",
      }}
    >
      <div className="projects-home-section__list">
        {featured.map((project, index) => (
          <ProjectShowcaseCard
            key={project.id}
            project={project}
            reversed={index % 2 === 1}
            priorityImage={index === 0}
          />
        ))}
      </div>

      {home.ctaLabel && home.ctaHref ? (
        <div className="projects-home-section__cta-wrap">
          <Link href={home.ctaHref} className="projects-home-section__cta">
            {home.ctaLabel}
          </Link>
        </div>
      ) : null}
    </HomeSectionShell>
  );
}
