import { ArrowRight } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import type { AboutHomeContent } from "@/types/about-home";
import { ButtonLink } from "@/components/ui/button-link";

import { AboutHomeHeadline } from "@/features/about-home/components/about-home-headline";

interface AboutHomeIntroProps {
  section: AboutHomeContent["section"];
  cta: AboutHomeContent["cta"];
  headingId: string;
}

export function AboutHomeIntro({ section, cta, headingId }: AboutHomeIntroProps) {
  const paragraphs = section.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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

      {paragraphs.length > 0 ? (
        <div className="about-home__description">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {cta.visible && cta.label && cta.href ? (
        <ButtonLink
          href={cta.href}
          variant="outline"
          size="lg"
          className={cn(
            "about-home__cta rounded-full border-border/70 bg-transparent px-7 hover:border-accent/40 hover:bg-surface/30",
            FOCUS_RING_CLASS,
          )}
        >
          {cta.label}
          <ArrowRight size={18} aria-hidden className="opacity-80" />
        </ButtonLink>
      ) : null}
    </div>
  );
}
