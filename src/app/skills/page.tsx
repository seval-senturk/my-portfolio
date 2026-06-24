import { skillsContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { SkillsSection } from "@/features/skills";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const skills = await skillsContentService.get();

  return createPageMetadata({
    title: "Skills",
    description: skills.section.description,
    pathname: ROUTES.skills,
  });
}

export default async function SkillsPage() {
  const skills = await skillsContentService.get();

  return <SkillsSection content={skills} titleAs="h1" />;
}
