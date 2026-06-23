import type { HeroContent } from "@/types/hero";
import type { StatItem } from "@/types/stats";

import { HeroActions } from "@/features/hero/components/hero-actions";
import { HeroEyebrow } from "@/features/hero/components/hero-eyebrow";
import { HeroHeadline } from "@/features/hero/components/hero-headline";
import { HeroSocialProof } from "@/features/hero/components/hero-social-proof";
import { HeroSummary } from "@/features/hero/components/hero-summary";
import { HeroTechnologyHighlights } from "@/features/hero/components/hero-technology-highlights";

interface HeroContentBlockProps {
  content: HeroContent;
  socialProof: readonly StatItem[];
}

export function HeroContentBlock({
  content,
  socialProof,
}: HeroContentBlockProps) {
  return (
    <div>
      <HeroEyebrow label={content.eyebrow} />
      <HeroHeadline headline={content.headline} />
      <HeroSummary summary={content.summary} />
      <HeroTechnologyHighlights
        title={content.technologyHighlightsTitle}
        highlights={content.technologyHighlights}
      />
      <HeroActions
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
      />
      <HeroSocialProof stats={socialProof} />
    </div>
  );
}
