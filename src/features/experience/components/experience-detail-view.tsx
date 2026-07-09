import { MapPin } from "lucide-react";
import type { ReactNode } from "react";

import type { ExperienceEntry } from "@/types/experience";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { formatEmploymentPeriod } from "@/lib/date";
import { cn } from "@/lib/cn";

interface ExperienceDetailViewProps {
  entries: readonly ExperienceEntry[];
}

function ExperienceDetailListMarker() {
  return (
    <span className="experience-detail-card__marker" aria-hidden>
      <svg
        className="experience-detail-card__marker-svg"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="4"
          className="experience-detail-card__marker-bg"
        />
        <path
          d="M6.25 5.25 9.75 8l-3.5 2.75"
          className="experience-detail-card__marker-icon"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ExperienceDetailListItem({ children }: { children: ReactNode }) {
  return (
    <li className="experience-detail-card__list-item">
      <ExperienceDetailListMarker />
      <span>{children}</span>
    </li>
  );
}

function ExperienceDetailCard({ entry }: { entry: ExperienceEntry }) {
  const period = formatEmploymentPeriod(entry);
  const hasResponsibilities = entry.responsibilities.length > 0;
  const hasTechnologies = entry.technologies.length > 0;
  const hasAchievements =
    entry.achievements !== undefined && entry.achievements.length > 0;

  return (
    <article className="career-rail-entry__card interactive-card experience-detail-card">
      <CardHoverOrbitals />

      <div className="career-rail-entry__meta">
        <time className="career-rail-entry__period" dateTime={period}>
          {period}
        </time>
        <span className="career-rail-entry__badge">
          {entry.current ? "CURRENT" : entry.employmentType.toUpperCase()}
        </span>
      </div>

      <h2 className="career-rail-entry__title">{entry.position}</h2>

      <p className="career-rail-entry__subtitle">
        <MapPin className="career-rail-entry__subtitle-icon" aria-hidden />
        <span>
          {entry.company} — {entry.location}
        </span>
      </p>

      {entry.summary ? (
        <p className="career-rail-entry__description experience-detail-card__summary">
          {entry.summary}
        </p>
      ) : null}

      {hasResponsibilities ? (
        <section className="experience-detail-card__block" aria-label="Key responsibilities">
          <h3 className="experience-detail-card__block-title">Key Responsibilities</h3>
          <ul className="experience-detail-card__list">
            {entry.responsibilities.map((item) => (
              <ExperienceDetailListItem key={item}>{item}</ExperienceDetailListItem>
            ))}
          </ul>
        </section>
      ) : null}

      {hasTechnologies ? (
        <section className="experience-detail-card__block" aria-label="Technologies">
          <h3 className="experience-detail-card__block-title">Technologies</h3>
          <ul className="career-rail-entry__tags">
            {entry.technologies.map((tag) => (
              <li key={tag}>
                <span className="career-rail-entry__tag">{tag}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasAchievements && entry.achievements ? (
        <section className="experience-detail-card__block" aria-label="Achievements">
          <h3 className="experience-detail-card__block-title">Achievements</h3>
          <ul className="experience-detail-card__list">
            {entry.achievements.map((item) => (
              <ExperienceDetailListItem key={item}>{item}</ExperienceDetailListItem>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

export function ExperienceDetailView({ entries }: ExperienceDetailViewProps) {
  const lastIndex = entries.length - 1;

  return (
    <ol className="career-rail-timeline experience-detail-timeline" aria-label="Work experience">
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className={cn(
            "career-rail-entry",
            index !== lastIndex && "career-rail-entry--spaced",
            (index === 0 || entry.current) && "career-rail-entry--highlighted",
          )}
        >
          <span className="career-rail-entry__marker" aria-hidden />
          <ExperienceDetailCard entry={entry} />
        </li>
      ))}
    </ol>
  );
}
