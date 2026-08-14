import Link from "next/link";

import type { ProjectsPageCta as ProjectsPageCtaContent } from "@/types/project";

interface ProjectsPageCtaProps {
  cta: ProjectsPageCtaContent;
}

export function ProjectsPageCta({ cta }: ProjectsPageCtaProps) {
  return (
    <section className="projects-page-cta" aria-labelledby="projects-cta-heading">
      <div className="projects-page-cta__decor" aria-hidden>
        <svg viewBox="0 0 200 200" className="projects-page-cta__orbital" fill="none">
          <circle cx="180" cy="180" r="40" className="projects-page-cta__ring" />
          <circle cx="180" cy="180" r="70" className="projects-page-cta__ring" />
          <circle cx="180" cy="180" r="100" className="projects-page-cta__ring" />
        </svg>
      </div>

      <div className="projects-page-cta__content">
        <h2 id="projects-cta-heading" className="projects-page-cta__title">
          {cta.title}
        </h2>
        <p className="projects-page-cta__description">{cta.description}</p>
        <Link href={cta.buttonHref} className="projects-page-cta__button">
          {cta.buttonLabel}
        </Link>
      </div>
    </section>
  );
}
