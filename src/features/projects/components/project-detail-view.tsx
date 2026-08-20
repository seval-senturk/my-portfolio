import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";

import type { ProjectEntry } from "@/types/project";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { formatEmploymentPeriod } from "@/lib/date";
import { getProjectYearLabel } from "@/lib/projects/format";
import { ProjectCoverImage } from "@/features/projects/components/project-cover-image";
import { ROUTES } from "@/constants/routes";

interface ProjectDetailViewProps {
  project: ProjectEntry;
}

function DetailList({ items, title }: { items: readonly string[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <section className="project-detail__block">
      <h2 className="project-detail__block-title">{title}</h2>
      <ul className="project-detail__list">
        {items.map((item) => (
          <li key={item} className="project-detail__list-item">
            <span className="project-detail-card__marker" aria-hidden>
              <svg viewBox="0 0 16 16" fill="none" className="project-detail-card__marker-svg">
                <rect x="1" y="1" width="14" height="14" rx="4" className="project-detail-card__marker-bg" />
        <path
          d="M6.25 5.25 9.75 8l-3.5 2.75"
          className="project-detail-card__marker-icon"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const period =
    project.startDate && project.endDate
      ? formatEmploymentPeriod({
          startDate: project.startDate,
          endDate: project.endDate,
          current: false,
        })
      : null;
  const yearLabel = getProjectYearLabel(project);

  return (
    <article className="project-detail">
      <header className="project-detail__hero interactive-card">
        <CardHoverOrbitals />

        {project.coverImage ? (
          <ProjectCoverImage
            src={project.coverImage}
            alt={project.coverImageAlt ?? project.title}
            priority
            className="project-detail__cover"
          />
        ) : (
          <div className="project-detail__cover project-detail__cover--placeholder" />
        )}

        <div className="project-detail__hero-content">
          <nav className="project-detail__breadcrumb" aria-label="Breadcrumb">
            <Link href={ROUTES.projects}>Projects</Link>
            <span aria-hidden>/</span>
            <span aria-current="page">{project.title}</span>
          </nav>

          <div className="project-detail__meta">
            <span className="project-detail__category">{project.category}</span>
            {project.projectType ? (
              <span className="project-detail__type">{project.projectType}</span>
            ) : null}
            {project.status ? (
              <span className="project-detail__status">{project.status}</span>
            ) : null}
          </div>

          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__summary">{project.shortDescription}</p>

          <div className="project-detail__facts">
            {yearLabel ? <span>{yearLabel}</span> : null}
            {period ? <span>{period}</span> : null}
            <span>{project.role}</span>
            {project.client ? <span>{project.client}</span> : null}
          </div>

          <div className="project-detail__actions">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                className="project-detail__action project-detail__action--primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
                <ArrowUpRight aria-hidden />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                className="project-detail__action"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 aria-hidden />
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="project-detail__content">
        <section className="project-detail__block">
          <h2 className="project-detail__block-title">Overview</h2>
          <p className="project-detail__text">{project.longDescription}</p>
        </section>

        {project.technologies.length > 0 ? (
          <section className="project-detail__block">
            <h2 className="project-detail__block-title">Technology Stack</h2>
            <ul className="project-detail__tags">
              {project.technologies.map((tag) => (
                <li key={tag}>
                  <span className="project-detail__tag">{tag}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <DetailList items={project.highlights ?? []} title="Highlights" />

        {project.caseStudy ? (
          <>
            <section className="project-detail__block">
              <h2 className="project-detail__block-title">Problem</h2>
              <p className="project-detail__text">{project.caseStudy.problem}</p>
            </section>
            <section className="project-detail__block">
              <h2 className="project-detail__block-title">Solution</h2>
              <p className="project-detail__text">{project.caseStudy.solution}</p>
            </section>
            <DetailList items={project.caseStudy.challenges} title="Challenges" />
            <DetailList items={project.caseStudy.results} title="Results" />
          </>
        ) : null}

        {project.metrics && project.metrics.length > 0 ? (
          <section className="project-detail__block">
            <h2 className="project-detail__block-title">Impact</h2>
            <dl className="project-detail__metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="project-detail__metric">
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </article>
  );
}
