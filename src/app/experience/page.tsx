import { experienceContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ExperienceSection } from "@/features/experience";
import { createPageMetadata } from "@/seo/metadata";

export async function generateMetadata() {
  const experience = await experienceContentService.get();

  return createPageMetadata({
    title: "Experience",
    description: experience.section.description,
    pathname: ROUTES.experience,
  });
}

export default async function ExperiencePage() {
  const experience = await experienceContentService.get();

  return <ExperienceSection content={experience} titleAs="h1" />;
}
