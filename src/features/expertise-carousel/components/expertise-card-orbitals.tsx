import { cn } from "@/lib/cn";

interface ExpertiseCardOrbitalsProps {
  className?: string;
}

export function ExpertiseCardOrbitals({ className }: ExpertiseCardOrbitalsProps) {
  return (
    <div className={cn("expertise-card__orbitals", className)} aria-hidden>
      <svg
        className="expertise-card__orbitals-svg"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax meet"
      >
        <circle cx="140" cy="140" r="22" className="expertise-card__orbital-ring" />
        <circle cx="140" cy="140" r="38" className="expertise-card__orbital-ring" />
        <circle cx="140" cy="140" r="54" className="expertise-card__orbital-ring" />
        <circle cx="140" cy="140" r="70" className="expertise-card__orbital-ring" />
        <circle cx="118" cy="118" r="1.5" className="expertise-card__orbital-dot" />
        <circle cx="102" cy="132" r="1.25" className="expertise-card__orbital-dot" />
        <circle cx="132" cy="98" r="1.25" className="expertise-card__orbital-dot" />
        <circle cx="88" cy="108" r="1" className="expertise-card__orbital-dot" />
      </svg>
    </div>
  );
}
