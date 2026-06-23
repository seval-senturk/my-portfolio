import { experienceContent } from "@/data/experience.data";
import { ROUTES } from "@/constants/routes";
import { ExperienceSection } from "@/features/experience";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Experience",
  description: experienceContent.section.description,
  pathname: ROUTES.experience,
});

export default function ExperiencePage() {
  return <ExperienceSection content={experienceContent} titleAs="h1" />;
}
