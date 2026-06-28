import type { HeroContent } from "@/types/hero";
import type { SiteSocialLink } from "@/types/social";

import { HeroDecorSvg } from "@/features/hero/components/hero-decor-svg";
import { HeroContentBlock } from "@/features/hero/components/hero-content";
import { HeroLayout } from "@/features/hero/components/hero-layout";
import { HeroPortrait } from "@/features/hero/components/hero-portrait";
import { Container } from "@/components/ui/container";

interface HeroSectionProps {
  content: HeroContent;
  socialLinks: readonly SiteSocialLink[];
}

export function HeroSection({ content, socialLinks }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-section relative -mt-16 min-h-[100svh] pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <HeroDecorSvg className="h-full w-full" />
      </div>

      <Container
        size="wide"
        className="hero-section__container relative pb-0 pt-0"
      >
        <HeroLayout
          content={
            <HeroContentBlock content={content} socialLinks={socialLinks} />
          }
          media={
            <HeroPortrait
              profile={content.profile}
              socialLinks={socialLinks}
            />
          }
        />
      </Container>
    </section>
  );
}
