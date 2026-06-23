import type { ProjectEntry } from "@/types/project";

import { ProjectCard } from "@/components/shared/project-card";
import { FeatureGrid } from "@/components/shared/feature-grid";

interface ProjectsGridViewProps {
  projects: readonly ProjectEntry[];
  showCaseStudyLink?: boolean;
}

export function ProjectsGridView({
  projects,
  showCaseStudyLink = false,
}: ProjectsGridViewProps) {
  return (
    <FeatureGrid columns={3}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            showCaseStudyLink={showCaseStudyLink}
          />
        </li>
      ))}
    </FeatureGrid>
  );
}
