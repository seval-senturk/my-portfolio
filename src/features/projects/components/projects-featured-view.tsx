import type { ProjectEntry, ProjectsSubsectionHeader } from "@/types/project";

import { ProjectsGridView } from "@/features/projects/components/projects-grid-view";
import { ProjectsSubsection } from "@/features/projects/components/projects-subsection";

interface ProjectsFeaturedViewProps {
  featured: readonly ProjectEntry[];
  additional: readonly ProjectEntry[];
  featuredHeader: ProjectsSubsectionHeader;
  additionalHeader: ProjectsSubsectionHeader;
  showCaseStudyLink?: boolean;
}

export function ProjectsFeaturedView({
  featured,
  additional,
  featuredHeader,
  additionalHeader,
  showCaseStudyLink = false,
}: ProjectsFeaturedViewProps) {
  const hasFeatured = featured.length > 0;
  const hasAdditional = additional.length > 0;

  if (!hasFeatured && !hasAdditional) {
    return null;
  }

  if (hasFeatured && !hasAdditional) {
    return (
      <ProjectsGridView
        projects={featured}
        showCaseStudyLink={showCaseStudyLink}
      />
    );
  }

  if (!hasFeatured && hasAdditional) {
    return (
      <ProjectsGridView
        projects={additional}
        showCaseStudyLink={showCaseStudyLink}
      />
    );
  }

  return (
    <>
      <ProjectsSubsection title={featuredHeader.title}>
        <ProjectsGridView
          projects={featured}
          showCaseStudyLink={showCaseStudyLink}
        />
      </ProjectsSubsection>
      <ProjectsSubsection title={additionalHeader.title}>
        <ProjectsGridView
          projects={additional}
          showCaseStudyLink={showCaseStudyLink}
        />
      </ProjectsSubsection>
    </>
  );
}
