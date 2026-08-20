import type { AboutHomeContent } from "@/types/about-home";
import { AboutHomeHeadline } from "@/features/about-home/components/about-home-headline";

interface AboutHomeIntroProps {
  section: AboutHomeContent["section"];
  headingId: string;
}

export function AboutHomeIntro({ section, headingId }: AboutHomeIntroProps) {
  return (
    <div className="about-home__intro">
      <p className="home-section-header__label">
        <span className="home-section-header__label-line" aria-hidden />
        {section.label}
      </p>

      <AboutHomeHeadline
        id={headingId}
        title={section.title}
        titleAccent={section.titleAccent}
      />

      {section.description ? (
        <p className="home-section-header__description about-home__description">
          {section.description}
        </p>
      ) : null}
    </div>
  );
}
