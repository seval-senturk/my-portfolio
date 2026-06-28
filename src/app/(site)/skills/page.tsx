import { ROUTES } from "@/constants/routes";
import { SkillsSection } from "@/features/skills";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { requestSkillsContent } from "@/lib/cache/request-dedupe";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const revalidate = 300;

export async function generateMetadata() {
  const skills = await requestSkillsContent();

  return buildPageMetadata(SEO_PAGE_KEYS.SKILLS, {
    title: "Skills",
    description: skills.section.description,
    pathname: ROUTES.skills,
  });
}

export default async function SkillsPage() {
  const skills = await requestSkillsContent();

  return <SkillsSection content={skills} titleAs="h1" />;
}
