import { AboutHomeIcon } from "@/features/about-home/components/about-home-icon";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import type { AboutHomeFeatureCard } from "@/types/about-home";
import { cn } from "@/lib/cn";

interface AboutHomeFeatureCardsProps {
  cards: readonly AboutHomeFeatureCard[];
}

export function AboutHomeFeatureCards({ cards }: AboutHomeFeatureCardsProps) {
  const visibleCards = cards.filter((card) => card.visible);

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="about-home__info-grid" role="list">
      {visibleCards.map((card) => (
        <article
          key={card.id}
          className={cn("about-home__info-card interactive-card")}
          role="listitem"
        >
          <CardHoverOrbitals />
          <span className="about-home__info-card-icon" aria-hidden>
            <AboutHomeIcon name={card.icon} size={20} />
          </span>
          <div className="about-home__info-card-copy">
            <p className="about-home__info-card-label">{card.title}</p>
            <p className="about-home__info-card-value">{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
