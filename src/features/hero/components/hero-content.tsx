import type { HeroContent } from "@/types/hero";

import { HeroActions } from "@/features/hero/components/hero-actions";
import { HeroHeadline } from "@/features/hero/components/hero-headline";

interface HeroContentBlockProps {
  content: HeroContent;
}

export function HeroContentBlock({ content }: HeroContentBlockProps) {
  return (
    <div className="hero-content-block">
      <HeroHeadline
        greeting={content.eyebrow}
        name={content.headline}
        jobTitle={content.jobTitle}
      />

      {content.summary ? (
        <p className="hero-content-block__summary">{content.summary}</p>
      ) : null}

      <HeroActions
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
      />
    </div>
  );
}
