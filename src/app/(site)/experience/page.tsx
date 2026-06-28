import { ROUTES } from "@/constants/routes";
import { ExperienceSection } from "@/features/experience";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { requestExperienceContent } from "@/lib/cache/request-dedupe";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const revalidate = 300;

export async function generateMetadata() {
  const experience = await requestExperienceContent();

  return buildPageMetadata(SEO_PAGE_KEYS.EXPERIENCE, {
    title: "Experience",
    description: experience.section.description,
    pathname: ROUTES.experience,
  });
}

export default async function ExperiencePage() {
  const experience = await requestExperienceContent();

  return <ExperienceSection content={experience} titleAs="h1" />;
}
