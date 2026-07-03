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
    <div className="about-home__features" role="list">
      {visibleCards.map((card) => (
        <article
          key={card.id}
          className={cn("about-home__feature-card interactive-card")}
          role="listitem"
        >
          <CardHoverOrbitals />
          <div className="about-home__feature-card-top">
            <span className="about-home__feature-card-icon" aria-hidden>
              <AboutHomeIcon name={card.icon} size={22} />
            </span>
            <span className="about-home__feature-card-number" aria-hidden>
              {card.number}
            </span>
          </div>

          <h3 className="about-home__feature-card-title">{card.title}</h3>
          <p className="about-home__feature-card-description">{card.description}</p>
          <span className="about-home__feature-card-accent" aria-hidden />
        </article>
      ))}
    </div>
  );
}
