import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

import type { ProjectEntry } from "@/types/project";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { getProjectDetailPath } from "@/lib/projects";
import { getProjectYearLabel } from "@/lib/projects/format";
import { ProjectCoverImage } from "@/features/projects/components/project-cover-image";
import { cn } from "@/lib/cn";

interface ProjectGridCardProps {
  project: ProjectEntry;
  priorityImage?: boolean;
  className?: string;
}

export function ProjectGridCard({
  project,
  priorityImage = false,
  className,
}: ProjectGridCardProps) {
  const detailHref = getProjectDetailPath(project.slug);
  const yearLabel = getProjectYearLabel(project);

  return (
    <article className={cn("project-grid-card interactive-card", className)}>
      <CardHoverOrbitals />

      <Link href={detailHref} className="project-grid-card__media-link">
        {project.coverImage ? (
          <ProjectCoverImage
            src={project.coverImage}
            alt={project.coverImageAlt ?? project.title}
            priority={priorityImage}
            className="project-grid-card__media"
          />
        ) : (
          <div className="project-grid-card__media project-grid-card__media--placeholder" aria-hidden />
        )}
      </Link>

      <div className="project-grid-card__body">
        <div className="project-grid-card__meta">
          <span className="project-grid-card__category">{project.category}</span>
          {project.projectType ? (
            <span className="project-grid-card__type">{project.projectType}</span>
          ) : null}
        </div>

        <h3 className="project-grid-card__title">
          <Link href={detailHref}>{project.title}</Link>
        </h3>

        <p className="project-grid-card__description">{project.shortDescription}</p>

        {project.technologies.length > 0 ? (
          <ul className="project-grid-card__tags" aria-label="Technology stack">
            {project.technologies.slice(0, 6).map((tag) => (
              <li key={tag}>
                <span className="project-grid-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="project-grid-card__footer">
          <div className="project-grid-card__footer-meta">
            {yearLabel ? <span>{yearLabel}</span> : null}
            {project.status ? <span>{project.status}</span> : null}
          </div>

          <div className="project-grid-card__actions">
            <Link href={detailHref} className="project-grid-card__action">
              View Project
              <ArrowUpRight className="project-grid-card__action-icon" aria-hidden />
            </Link>
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                className="project-grid-card__action project-grid-card__action--icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <Code2 aria-hidden />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                className="project-grid-card__action project-grid-card__action--icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo for ${project.title}`}
              >
                <ArrowUpRight aria-hidden />
              </a>
            ) : null}
          </div>
        </footer>
      </div>
    </article>
  );
}
