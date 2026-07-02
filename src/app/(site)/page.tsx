import {
  requestHeroContent,
  requestExpertiseCarouselContent,
  requestAboutHomeContent,
  requestExperienceContent,
  requestEducationHomeContent,
  requestTestimonialsContent,
  requestSiteSocialLinks,
} from "@/lib/cache/request-dedupe";
import { HeroSection } from "@/features/hero";
import { ExpertiseCarouselSection } from "@/features/expertise-carousel";
import { AboutHomeSection } from "@/features/about-home";
import { CareerJourneySection } from "@/features/experience";
import { TestimonialsSection } from "@/features/testimonials";
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
  const [hero, socialLinks, aboutHome, experience, educationHome, testimonials, expertiseCarousel] =
    await Promise.all([
      requestHeroContent(),
      requestSiteSocialLinks(),
      requestAboutHomeContent(),
      requestExperienceContent(),
      requestEducationHomeContent(),
      requestTestimonialsContent(),
      requestExpertiseCarouselContent(),
    ]);

  return (
    <>
      <HeroSection content={hero} socialLinks={socialLinks} />
      <AboutHomeSection content={aboutHome} />
      <CareerJourneySection experience={experience} education={educationHome} />
      <TestimonialsSection content={testimonials} />
      <ExpertiseCarouselSection content={expertiseCarousel} />
    </>
  );
}
