import Image from "next/image";

import type { HeroProfile, HeroTechnologyCard } from "@/types/hero";
import { HeroFloatingTechCard } from "@/features/hero/components/hero-floating-tech-card";
import { optimizePortraitUrl } from "@/lib/media/optimize-portrait-url";
import { cn } from "@/lib/cn";

const PROFILE_SIZE = 900;

interface HeroPortraitProps {
  profile: HeroProfile;
  technologyCards: readonly HeroTechnologyCard[];
  className?: string;
}

export function HeroPortrait({
  profile,
  technologyCards,
  className,
}: HeroPortraitProps) {
  if (!profile.visible) {
    return null;
  }

  const hasImage = Boolean(profile.imageSrc);
  const imageSrc = profile.imageSrc
    ? optimizePortraitUrl(profile.imageSrc)
    : undefined;
  const visibleCards = technologyCards.filter((card) => card.visible);

  return (
    <div className={cn("hero-portrait", className)}>
      <div className="hero-portrait__stage">
        {visibleCards.length > 0 ? (
          <div className="hero-portrait__tech-cards">
            {visibleCards.map((card) => (
              <HeroFloatingTechCard key={card.id} card={card} />
            ))}
          </div>
        ) : null}

        {hasImage && imageSrc ? (
          <Image
            src={imageSrc}
            alt={profile.imageAlt}
            width={PROFILE_SIZE}
            height={PROFILE_SIZE}
            priority
            className="hero-portrait__photo"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 560px"
          />
        ) : (
          <div
            role="img"
            aria-label={profile.imageAlt}
            className="hero-portrait__photo hero-portrait__photo--fallback"
          >
            <span className="hero-portrait__initials" aria-hidden>
              {profile.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
