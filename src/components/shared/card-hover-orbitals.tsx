import { cn } from "@/lib/cn";

interface CardHoverOrbitalsProps {
  className?: string;
}

export function CardHoverOrbitals({ className }: CardHoverOrbitalsProps) {
  return (
    <div className={cn("card-hover-orbitals", className)} aria-hidden>
      <svg
        className="card-hover-orbitals__svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <circle cx="100" cy="100" r="18" className="card-hover-orbitals__ring" />
        <circle cx="100" cy="100" r="32" className="card-hover-orbitals__ring" />
        <circle cx="100" cy="100" r="46" className="card-hover-orbitals__ring" />
        <circle
          cx="100"
          cy="100"
          r="60"
          className="card-hover-orbitals__ring card-hover-orbitals__ring--accent"
        />
      </svg>
    </div>
  );
}
