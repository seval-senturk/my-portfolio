import type { HeroContent } from "@/types/hero";

import { HeroContentBlock } from "@/features/hero/components/hero-content";
import { HeroLayout } from "@/features/hero/components/hero-layout";
import { HeroNetworkBackground } from "@/features/hero/components/hero-network-background";
import { HeroPortrait } from "@/features/hero/components/hero-portrait";
import { HeroStatsBar } from "@/features/hero/components/hero-stats-bar";
import { Container } from "@/components/ui/container";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const showStats = content.statsEnabled && content.stats.length > 0;

  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-section relative isolate -mt-16 min-h-[100svh] pt-16 lg:-mt-[4.5rem] lg:pt-[4.5rem]"
    >
      <HeroNetworkBackground />
      <div className="hero-section__backdrop" aria-hidden />

      <Container size="wide" className="hero-section__container relative z-[2]">
        <HeroLayout
          content={<HeroContentBlock content={content} />}
          media={
            <HeroPortrait
              profile={content.profile}
              technologyCards={content.technologyCards}
            />
          }
          footer={showStats ? <HeroStatsBar stats={content.stats} /> : null}
        />
      </Container>
    </section>
  );
}
