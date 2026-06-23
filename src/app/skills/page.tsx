import { ROUTES } from "@/constants/routes";
import { PagePlaceholder } from "@/features/layout";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Skills",
  pathname: ROUTES.skills,
});

export default function SkillsPage() {
  return <PagePlaceholder title="Skills" />;
}
