import Link from "next/link";

import type { HeroTechnologyCard } from "@/types/hero";
import { HeroTechIcon } from "@/features/hero/config/hero-tech-icons.config";
import { cn } from "@/lib/cn";

interface HeroFloatingTechCardProps {
  card: HeroTechnologyCard;
}

export function HeroFloatingTechCard({ card }: HeroFloatingTechCardProps) {
  const content = (
    <>
      <span className="hero-tech-card__icon">
        <HeroTechIcon icon={card.icon} />
      </span>
      <span className="hero-tech-card__label">{card.title}</span>
    </>
  );

  const className = cn(
    "hero-tech-card",
    `hero-tech-card--pos-${card.position}`,
  );

  if (card.href) {
    return (
      <Link href={card.href} className={className} aria-label={card.title}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} aria-label={card.title}>
      {content}
    </div>
  );
}
