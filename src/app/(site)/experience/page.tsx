import { experienceContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ExperienceSection } from "@/features/experience";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const experience = await experienceContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.EXPERIENCE, {
    title: "Experience",
    description: experience.section.description,
    pathname: ROUTES.experience,
  });
}

export default async function ExperiencePage() {
  const experience = await experienceContentService.get();

  return <ExperienceSection content={experience} titleAs="h1" />;
}
