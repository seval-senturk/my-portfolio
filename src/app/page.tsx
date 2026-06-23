import { heroContent } from "@/data/hero.data";
import { AboutSection } from "@/features/about";
import { HeroSection } from "@/features/hero";
import { createPageMetadata } from "@/seo/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata = createPageMetadata({
  description: heroContent.summary,
  pathname: ROUTES.home,
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  );
}
