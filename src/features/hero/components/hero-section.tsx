import { heroContent } from "@/data/hero.data";
import { professionalHighlights } from "@/data/professional-highlights.data";
import type { HeroContent } from "@/types/hero";
import { selectStats } from "@/lib/content";

import { HeroContentBlock } from "@/features/hero/components/hero-content";
import { HeroLayout } from "@/features/hero/components/hero-layout";
import { HeroProfileImage } from "@/features/hero/components/hero-profile-image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const HERO_SOCIAL_PROOF_LIMIT = 3;

interface HeroSectionProps {
  content?: HeroContent;
}

export function HeroSection({ content = heroContent }: HeroSectionProps) {
  const socialProof = selectStats(
    professionalHighlights,
    HERO_SOCIAL_PROOF_LIMIT,
  );

  return (
    <Section spacing="default" aria-labelledby="hero-heading">
      <Container size="wide">
        <HeroLayout
          content={
            <HeroContentBlock content={content} socialProof={socialProof} />
          }
          media={<HeroProfileImage profile={content.profile} />}
        />
      </Container>
    </Section>
  );
}
