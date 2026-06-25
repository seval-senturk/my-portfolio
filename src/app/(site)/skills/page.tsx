import { skillsContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { SkillsSection } from "@/features/skills";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const skills = await skillsContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.SKILLS, {
    title: "Skills",
    description: skills.section.description,
    pathname: ROUTES.skills,
  });
}

export default async function SkillsPage() {
  const skills = await skillsContentService.get();

  return <SkillsSection content={skills} titleAs="h1" />;
}
