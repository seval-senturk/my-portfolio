import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { aboutContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { AboutSection } from "@/features/about";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const about = await aboutContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.ABOUT, {
    title: "About",
    description: about.section.description,
    pathname: ROUTES.about,
  });
}

export default async function AboutPage() {
  const about = await aboutContentService.get();

  return <AboutSection content={about} titleAs="h1" />;
}
