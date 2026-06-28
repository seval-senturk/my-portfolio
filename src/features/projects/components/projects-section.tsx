import type { ProjectsContent } from "@/types/project";
import type { HeadingLevel } from "@/types/ui";
import { ROUTES } from "@/constants/routes";
import { partitionFeaturedProjects } from "@/lib/projects";

import { ProjectsFeaturedView } from "@/features/projects/components/projects-featured-view";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface ProjectsSectionProps {
  content: ProjectsContent;
  titleAs?: HeadingLevel;
  showCaseStudyLink?: boolean;
}

export function ProjectsSection({
  content,
  titleAs = "h2",
  showCaseStudyLink = false,
}: ProjectsSectionProps) {
  const { section, featured, additional, entries } = content;
  const { featured: featuredProjects, additional: additionalProjects } =
    partitionFeaturedProjects(entries);

  return (
    <Section
      id="projects"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="projects-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <ProjectsFeaturedView
          featured={featuredProjects}
          additional={additionalProjects}
          featuredHeader={featured}
          additionalHeader={additional}
          showCaseStudyLink={showCaseStudyLink}
        />
        <div className="mt-8 border-t border-border pt-6">
          <ButtonLink href={ROUTES.resume} variant="outline">
            Download resume (PDF)
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
