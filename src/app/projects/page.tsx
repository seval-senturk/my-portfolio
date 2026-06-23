import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Projects",
  pathname: ROUTES.projects,
});

export default function ProjectsPage() {
  return <PagePlaceholder title="Projects" />;
}
