import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { ROUTES } from "@/constants/routes";
import { AboutSection } from "@/features/about";
import { requestAboutContent } from "@/lib/cache/request-dedupe";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const revalidate = 300;

export async function generateMetadata() {
  const about = await requestAboutContent();

  return buildPageMetadata(SEO_PAGE_KEYS.ABOUT, {
    title: "About",
    description: about.section.description,
    pathname: ROUTES.about,
  });
}

export default async function AboutPage() {
  const about = await requestAboutContent();

  return <AboutSection content={about} titleAs="h1" />;
}
