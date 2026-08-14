import type { ProjectsContent } from "@/types/project";

import { HomeSectionHeader } from "@/components/sections/home-section-header";
import { Container } from "@/components/ui/container";
import { ProjectsPageBody } from "@/features/projects/components/projects-page-body";

interface ProjectsPageSectionProps {
  content: ProjectsContent;
  headingLevel?: "h1" | "h2";
}

export function ProjectsPageSection({
  content,
  headingLevel = "h2",
}: ProjectsPageSectionProps) {
  if (!content.visible || content.entries.length === 0) {
    return null;
  }

  const headingId = "projects-page-heading";

  return (
    <section className="projects-page" aria-labelledby={headingId}>
      <div className="projects-page__hero-decor" aria-hidden>
        <svg viewBox="0 0 400 400" className="projects-page__hero-orbital" fill="none">
          <circle cx="360" cy="360" r="48" className="projects-page__hero-ring" />
          <circle cx="360" cy="360" r="88" className="projects-page__hero-ring" />
          <circle cx="360" cy="360" r="128" className="projects-page__hero-ring" />
          <circle cx="360" cy="360" r="168" className="projects-page__hero-ring projects-page__hero-ring--accent" />
        </svg>
        <span className="projects-page__hero-shape projects-page__hero-shape--one" />
        <span className="projects-page__hero-shape projects-page__hero-shape--two" />
      </div>

      <Container size="wide" className="projects-page__container">
        <HomeSectionHeader
          headingId={headingId}
          headingLevel={headingLevel}
          label={content.hero.label}
          title={content.hero.title}
          titleAccent={content.hero.titleAccent}
          description={content.hero.description}
          descriptionClassName="projects-page__hero-description"
        />

        <ProjectsPageBody content={content} />
      </Container>
    </section>
  );
}
