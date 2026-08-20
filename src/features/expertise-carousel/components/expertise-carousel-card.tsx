import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import type { ExpertiseCarouselItem } from "@/types/expertise-carousel";
import { ExpertiseCardOrbitals } from "@/features/expertise-carousel/components/expertise-card-orbitals";
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
  const hasCta = Boolean(item.ctaLabel?.trim() && item.ctaHref?.trim());

  return (
    <article className={cn("expertise-card interactive-card group", className)}>
      <ExpertiseCardOrbitals />

      <div className="expertise-card__inner">
        <header className="expertise-card__header">
          <div className="expertise-card__icon-wrap" aria-hidden="true">
            <Icon className="expertise-card__icon" strokeWidth={1.35} />
          </div>

          <div className="expertise-card__heading">
            <h3 className="expertise-card__title">{item.title}</h3>
          </div>
        </header>

        {hasDescription ? (
          <p className="expertise-card__description">{item.description}</p>
        ) : null}

        {hasBullets ? (
          <ul className="expertise-card__list">
            {item.bulletItems.map((bullet) => (
              <li key={bullet} className="expertise-card__list-item">
                <span className="expertise-card__bullet" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {hasCta ? (
          <footer className="expertise-card__footer">
            <div className="expertise-card__divider" aria-hidden />
            <Link
              href={item.ctaHref!}
              className={cn("expertise-card__cta", FOCUS_RING_CLASS)}
            >
              <span className="expertise-card__cta-label">{item.ctaLabel}</span>
              <span className="expertise-card__cta-icon" aria-hidden>
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </span>
            </Link>
          </footer>
        ) : null}
      </div>
    </article>
  );
}
