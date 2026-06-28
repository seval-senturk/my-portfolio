import Link from "next/link";

import type { ExpertiseCarouselItem } from "@/types/expertise-carousel";
import { resolveExpertiseIcon } from "@/features/expertise-carousel/config/expertise-icons.config";
import { cn } from "@/lib/cn";

interface ExpertiseCarouselCardProps {
  item: ExpertiseCarouselItem;
  className?: string;
}

export function ExpertiseCarouselCard({
  item,
  className,
}: ExpertiseCarouselCardProps) {
  const Icon = resolveExpertiseIcon(item.icon);
  const hasBullets = item.bulletItems.length > 0;
  const hasDescription = Boolean(item.description?.trim());

  return (
    <article className={cn("expertise-card group", className)}>
      <div className="expertise-card__rings" aria-hidden="true">
        <svg
          className="expertise-card__rings-svg"
          viewBox="0 0 400 533"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <circle cx="400" cy="0" r="56" className="expertise-card__ring" />
          <circle cx="400" cy="0" r="96" className="expertise-card__ring" />
          <circle cx="400" cy="0" r="136" className="expertise-card__ring" />
          <circle cx="400" cy="533" r="56" className="expertise-card__ring" />
          <circle cx="400" cy="533" r="96" className="expertise-card__ring" />
          <circle cx="400" cy="533" r="136" className="expertise-card__ring" />
        </svg>
      </div>

      <div className="expertise-card__body">
        <div className="expertise-card__icon-wrap" aria-hidden="true">
          <Icon className="expertise-card__icon" strokeWidth={1.5} />
        </div>

        <h3 className="expertise-card__title">{item.title}</h3>

        {hasDescription ? (
          <p className="expertise-card__description">{item.description}</p>
        ) : null}

        {hasBullets ? (
          <ul className="expertise-card__list">
            {item.bulletItems.map((bullet) => (
              <li key={bullet} className="expertise-card__list-item">
                <span className="expertise-card__bullet" aria-hidden="true">
                  »
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.ctaLabel && item.ctaHref ? (
          <div className="expertise-card__cta">
            <Link href={item.ctaHref} className="expertise-card__cta-link">
              {item.ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
