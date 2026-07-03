import type { LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { cn } from "@/lib/cn";

export interface CareerRailEntryData {
  id: string;
  period: string;
  badge?: string;
  title: string;
  subtitle: string;
  subtitleIcon: LucideIcon;
  description: string;
  tags?: readonly string[];
  isHighlighted?: boolean;
}

interface CareerRailEntryProps {
  entry: CareerRailEntryData;
  isLast?: boolean;
}

export function CareerRailEntry({ entry, isLast = false }: CareerRailEntryProps) {
  const SubtitleIcon = entry.subtitleIcon;

  return (
    <li
      className={cn(
        "career-rail-entry",
        !isLast && "career-rail-entry--spaced",
        entry.isHighlighted && "career-rail-entry--highlighted",
      )}
    >
      <span className="career-rail-entry__marker" aria-hidden />

      <article className="career-rail-entry__card interactive-card">
        <CardHoverOrbitals />
        <div className="career-rail-entry__meta">
          <time className="career-rail-entry__period" dateTime={entry.period}>
            {entry.period}
          </time>
          {entry.badge ? (
            <span className="career-rail-entry__badge">{entry.badge}</span>
          ) : null}
        </div>

        <h3 className="career-rail-entry__title">{entry.title}</h3>

        <p className="career-rail-entry__subtitle">
          <SubtitleIcon className="career-rail-entry__subtitle-icon" aria-hidden />
          <span>{entry.subtitle}</span>
        </p>

        {entry.description ? (
          <p className="career-rail-entry__description">{entry.description}</p>
        ) : null}

        {entry.tags && entry.tags.length > 0 ? (
          <ul className="career-rail-entry__tags" aria-label="Related skills">
            {entry.tags.map((tag) => (
              <li key={tag}>
                <span className="career-rail-entry__tag">{tag}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </li>
  );
}

interface CareerRailTimelineProps {
  entries: readonly CareerRailEntryData[];
  "aria-label": string;
}

export function CareerRailTimeline({ entries, "aria-label": ariaLabel }: CareerRailTimelineProps) {
  const lastIndex = entries.length - 1;

  return (
    <ol className="career-rail-timeline" aria-label={ariaLabel}>
      {entries.map((entry, index) => (
        <CareerRailEntry key={entry.id} entry={entry} isLast={index === lastIndex} />
      ))}
    </ol>
  );
}

interface CareerRailColumnHeaderProps {
  label: string;
  title: string;
  description?: string;
  headingId: string;
}

export function CareerRailColumnHeader({
  label,
  title,
  description,
  headingId,
}: CareerRailColumnHeaderProps) {
  return (
    <header className="career-rail-column__header">
      <p className="career-rail-column__label">
        <span className="career-rail-column__label-bars" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <h3 id={headingId} className="career-rail-column__title">
        {title}
      </h3>
      {description ? (
        <p className="career-rail-column__description">{description}</p>
      ) : null}
    </header>
  );
}

interface CareerRailColumnProps {
  label: string;
  title: string;
  description?: string;
  headingId: string;
  children: ReactNode;
}

export function CareerRailColumn({
  label,
  title,
  description,
  headingId,
  children,
}: CareerRailColumnProps) {
  return (
    <section className="career-rail-column" aria-labelledby={headingId}>
      <CareerRailColumnHeader
        label={label}
        title={title}
        description={description}
        headingId={headingId}
      />
      {children}
    </section>
  );
}
