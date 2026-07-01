import type { AboutHomeContent } from "@/types/about-home";
import { Container } from "@/components/ui/container";
import { AboutHomeActions } from "@/features/about-home/components/about-home-actions";
import { AboutHomeProfile } from "@/features/about-home/components/about-home-profile";
import { AboutHomeQuickInfo } from "@/features/about-home/components/about-home-quick-info";
import { AboutHomeStats } from "@/features/about-home/components/about-home-stats";
import { AboutHomeTitle } from "@/features/about-home/components/about-home-title";

interface AboutHomeSectionProps {
  content: AboutHomeContent;
}

export function AboutHomeSection({ content }: AboutHomeSectionProps) {
  if (!content.section.visible) {
    return null;
  }

  const headingId = "about-home-heading";

  return (
    <section
      id="about"
      aria-labelledby={headingId}
      className="about-home"
    >
      <Container size="wide" className="about-home__container">
        <div className="about-home__layout">
          <AboutHomeProfile profile={content.profile} />

          <div className="about-home__content">
            <p className="about-home__label">{content.section.label}</p>
            <AboutHomeTitle
              id={headingId}
              title={content.section.title}
              titleAccent={content.section.titleAccent}
            />
            <p className="about-home__description">{content.section.description}</p>
            <AboutHomeQuickInfo items={content.quickInfo} />
            <AboutHomeStats items={content.stats} />
            <AboutHomeActions actions={content.actions} />
          </div>
        </div>
      </Container>
    </section>
  );
}
