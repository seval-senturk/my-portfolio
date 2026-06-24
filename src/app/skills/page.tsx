import { skillsContent } from "@/data/skills.data";
import { ROUTES } from "@/constants/routes";
import { SkillsSection } from "@/features/skills";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Skills",
  description: skillsContent.section.description,
  pathname: ROUTES.skills,
});

export default function SkillsPage() {
  return <SkillsSection content={skillsContent} titleAs="h1" />;
}
