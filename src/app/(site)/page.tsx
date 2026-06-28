import { Suspense } from "react";

import {
  requestHeroContent,
  requestExpertiseCarouselContent,
  requestSiteSocialLinks,
} from "@/lib/cache/request-dedupe";
import { HeroSection } from "@/features/hero";
import { ExpertiseCarouselSection } from "@/features/expertise-carousel";
import {
  HomeBelowFoldSections,
  HomeBelowFoldSkeleton,
} from "@/features/home";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { ROUTES } from "@/constants/routes";

export const revalidate = 300;

export async function generateMetadata() {
  const hero = await requestHeroContent();

  return buildPageMetadata(SEO_PAGE_KEYS.HOME, {
    description: hero.summary,
    pathname: ROUTES.home,
  });
}

export default async function HomePage() {
  const [hero, socialLinks, expertiseCarousel] = await Promise.all([
    requestHeroContent(),
    requestSiteSocialLinks(),
    requestExpertiseCarouselContent(),
  ]);

  return (
    <>
      <HeroSection content={hero} socialLinks={socialLinks} />
      <ExpertiseCarouselSection content={expertiseCarousel} />
      <Suspense fallback={<HomeBelowFoldSkeleton />}>
        <HomeBelowFoldSections />
      </Suspense>
    </>
  );
}
