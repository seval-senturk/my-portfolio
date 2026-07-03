import type { AboutHomeContent } from "@/types/about-home";
import { HomeSectionHeader, HomeSectionShell } from "@/components/sections";
import { AboutHomeActions } from "@/features/about-home/components/about-home-actions";
import { AboutHomeProfile } from "@/features/about-home/components/about-home-profile";
import { AboutHomeQuickInfo } from "@/features/about-home/components/about-home-quick-info";
import { AboutHomeStats } from "@/features/about-home/components/about-home-stats";

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
      <div className="about-home__layout">
        <AboutHomeProfile profile={content.profile} />

        <div className="about-home__content">
          <HomeSectionHeader
            as="div"
            withSectionSpacing={false}
            label={content.section.label}
            title={content.section.title}
            titleAccent={content.section.titleAccent}
            description={content.section.description}
            headingId={headingId}
            descriptionClassName="home-section-header__description--flow"
          />
          <AboutHomeQuickInfo items={content.quickInfo} />
          <AboutHomeStats items={content.stats} />
          <AboutHomeActions actions={content.actions} />
        </div>
      </div>
    </HomeSectionShell>
  );
}
