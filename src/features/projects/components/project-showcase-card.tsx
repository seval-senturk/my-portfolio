import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

import type { ProjectEntry } from "@/types/project";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { getProjectDetailPath } from "@/lib/projects";
import { getProjectYearLabel } from "@/lib/projects/format";
import { ProjectCoverImage } from "@/features/projects/components/project-cover-image";
import { cn } from "@/lib/cn";

interface ProjectShowcaseCardProps {
  project: ProjectEntry;
  reversed?: boolean;
  priorityImage?: boolean;
}

export function ProjectShowcaseCard({
  project,
  reversed = false,
  priorityImage = false,
}: ProjectShowcaseCardProps) {
  const detailHref = getProjectDetailPath(project.slug);
  const yearLabel = getProjectYearLabel(project);

  return (
    <article
      className={cn(
        "project-showcase-card interactive-card",
        reversed && "project-showcase-card--reversed",
      )}
    >
      <CardHoverOrbitals />

      <div className="project-showcase-card__media">
        {project.coverImage ? (
          <ProjectCoverImage
            src={project.coverImage}
            alt={project.coverImageAlt ?? project.title}
            priority={priorityImage}
            className="project-showcase-card__image"
          />
        ) : (
          <div className="project-showcase-card__image project-showcase-card__image--placeholder" />
        )}
      </div>

      <div className="project-showcase-card__content">
        <div className="project-showcase-card__meta">
          <span className="project-showcase-card__category">{project.category}</span>
          {project.status ? (
            <span className="project-showcase-card__status">{project.status}</span>
          ) : null}
        </div>

        <h3 className="project-showcase-card__title">{project.title}</h3>
        <p className="project-showcase-card__description">{project.shortDescription}</p>

        {project.technologies.length > 0 ? (
          <ul className="project-showcase-card__tags" aria-label="Technology stack">
            {project.technologies.slice(0, 8).map((tag) => (
              <li key={tag}>
                <span className="project-showcase-card__tag">{tag}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="project-showcase-card__footer">
          {yearLabel ? (
            <span className="project-showcase-card__year">{yearLabel}</span>
          ) : null}

          <div className="project-showcase-card__actions">
            <Link href={detailHref} className="project-showcase-card__action">
              Case Study
              <ArrowUpRight className="project-showcase-card__action-icon" aria-hidden />
            </Link>
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                className="project-showcase-card__action"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="project-showcase-card__action-icon" aria-hidden />
                GitHub
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                className="project-showcase-card__action"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
                <ArrowUpRight className="project-showcase-card__action-icon" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
