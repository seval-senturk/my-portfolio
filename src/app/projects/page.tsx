import { projectsContent } from "@/data/projects.data";
import { ROUTES } from "@/constants/routes";
import { ProjectsSection } from "@/features/projects";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Projects",
  description: projectsContent.section.description,
  pathname: ROUTES.projects,
});

export default function ProjectsPage() {
  return <ProjectsSection content={projectsContent} titleAs="h1" />;
}
