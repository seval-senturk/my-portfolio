import { aboutContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { AboutSection } from "@/features/about";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const about = await aboutContentService.get();

  return createPageMetadata({
    title: "About",
    description: about.section.description,
    pathname: ROUTES.about,
  });
}

export default async function AboutPage() {
  const about = await aboutContentService.get();

  return <AboutSection content={about} titleAs="h1" />;
}
