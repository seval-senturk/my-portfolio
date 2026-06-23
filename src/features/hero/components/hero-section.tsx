import { heroContent } from "@/data/hero.data";

import { HeroContentBlock } from "@/features/hero/components/hero-content";
import { HeroProfileImage } from "@/features/hero/components/hero-profile-image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function HeroSection() {
  return (
    <Section spacing="default" aria-labelledby="hero-heading">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <HeroContentBlock content={heroContent} />
          <HeroProfileImage profile={heroContent.profile} />
        </div>
      </Container>
    </Section>
  );
}
