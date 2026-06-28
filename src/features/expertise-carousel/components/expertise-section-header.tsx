import { cn } from "@/lib/cn";

interface ExpertiseSectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  headingId: string;
  className?: string;
}

export function ExpertiseSectionHeader({
  label,
  title,
  description,
  headingId,
  className,
}: ExpertiseSectionHeaderProps) {
  return (
    <header className={cn("expertise-section__header", className)}>
      <p className="expertise-section__label">
        <span className="expertise-section__label-bars" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <h2 id={headingId} className="expertise-section__title">
        {title}
      </h2>
      {description ? (
        <p className="expertise-section__description max-w-2xl">
          {description}
        </p>
      ) : null}
    </header>
  );
}
