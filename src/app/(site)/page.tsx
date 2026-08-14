import {
  requestHeroContent,
  requestExpertiseCarouselContent,
  requestAboutHomeContent,
  requestExperienceContent,
  requestEducationHomeContent,
  requestTestimonialsContent,
  requestBlogHomeContent,
  requestProjectsContent,
  requestContactContent,
} from "@/lib/cache/request-dedupe";
import { HeroSection } from "@/features/hero";
import { ExpertiseCarouselSection } from "@/features/expertise-carousel";
import { AboutHomeSection } from "@/features/about-home";
import { CareerJourneySection } from "@/features/experience";
import { TestimonialsSection } from "@/features/testimonials";
import { BlogHomeSection } from "@/features/blog-home";
import { ProjectsHomeSection } from "@/features/projects/components/projects-home-section";
import { ContactSection } from "@/features/contact/components/contact-section";
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
  const [
    hero,
    aboutHome,
    experience,
    educationHome,
    expertiseCarousel,
    projects,
    testimonials,
    blogHome,
    contact,
  ] = await Promise.all([
    requestHeroContent(),
    requestAboutHomeContent(),
    requestExperienceContent(),
    requestEducationHomeContent(),
    requestExpertiseCarouselContent(),
    requestProjectsContent(),
    requestTestimonialsContent(),
    requestBlogHomeContent(),
    requestContactContent(),
  ]);

  return (
    <>
      <HeroSection content={hero} />
      <AboutHomeSection content={aboutHome} />
      <ExpertiseCarouselSection content={expertiseCarousel} />
      <CareerJourneySection experience={experience} education={educationHome} />
      <ProjectsHomeSection content={projects} />
      <TestimonialsSection content={testimonials} />
      <BlogHomeSection content={blogHome} />
      <ContactSection content={contact} />
    </>
  );
}
