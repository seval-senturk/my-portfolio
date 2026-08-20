import type { AboutHomeContent } from "@/types/about-home";
import { HomeSectionShell } from "@/components/sections";
import { AboutHomeDecor } from "@/features/about-home/components/about-home-decor";
import { AboutHomeActions } from "@/features/about-home/components/about-home-actions";
import { AboutHomeFeatureCards } from "@/features/about-home/components/about-home-feature-cards";
import { AboutHomeIntro } from "@/features/about-home/components/about-home-intro";
import { AboutHomePortrait } from "@/features/about-home/components/about-home-portrait";

interface AboutHomeSectionProps {
  content: AboutHomeContent;
}

export function AboutHomeSection({ content }: AboutHomeSectionProps) {
  if (!content.section.visible) {
    return null;
  }

  const headingId = "about-home-heading";

  return (
    <HomeSectionShell
      id="about"
      headingId={headingId}
      sectionClassName="about-home"
    >
      <AboutHomeDecor className="about-home__decor" />

      <div className="about-home__layout">
        <AboutHomePortrait profile={content.profile} />

        <div className="about-home__content">
          <AboutHomeIntro section={content.section} headingId={headingId} />
          <AboutHomeFeatureCards cards={content.featureCards} />
          <AboutHomeActions
            primaryCta={content.cta}
            secondaryCta={content.secondaryCta}
          />
        </div>
      </div>
    </HomeSectionShell>
  );
}
