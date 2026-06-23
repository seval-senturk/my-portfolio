import { aboutContent } from "@/data/about.data";
import { ROUTES } from "@/constants/routes";
import { AboutSection } from "@/features/about";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description: aboutContent.section.description,
  pathname: ROUTES.about,
});

export default function AboutPage() {
  return <AboutSection titleAs="h1" />;
}
