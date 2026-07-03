import type { AboutHomeContent } from "@/types/about-home";
import { HomeSectionShell } from "@/components/sections";
import { AboutHomeDecor } from "@/features/about-home/components/about-home-decor";
import { AboutHomeFeatureCards } from "@/features/about-home/components/about-home-feature-cards";
import { AboutHomeIntro } from "@/features/about-home/components/about-home-intro";

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
        <AboutHomeIntro
          section={content.section}
          cta={content.cta}
          headingId={headingId}
        />
        <AboutHomeFeatureCards cards={content.featureCards} />
      </div>
    </HomeSectionShell>
  );
}
