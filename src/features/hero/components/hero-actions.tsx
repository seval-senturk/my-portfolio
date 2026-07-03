import { Briefcase, Download } from "lucide-react";

import type { HeroCta } from "@/types/hero";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

import { ButtonLink } from "@/components/ui/button-link";

interface HeroActionsProps {
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
}

export function HeroActions({ primaryCta, secondaryCta }: HeroActionsProps) {
  const showPrimary = primaryCta.visible && primaryCta.label && primaryCta.href;
  const showSecondary =
    secondaryCta.visible && secondaryCta.label && secondaryCta.href;

  if (!showPrimary && !showSecondary) {
    return null;
  }

  return (
    <div className="hero-actions">
      {showPrimary ? (
        <ButtonLink
          href={primaryCta.href}
          variant="primary"
          size="lg"
          className={cn(
            "hero-actions__primary rounded-full px-7 shadow-[0_12px_32px_rgba(124,131,255,0.28)]",
            FOCUS_RING_CLASS,
          )}
        >
          {primaryCta.label}
          <Briefcase size={18} aria-hidden className="opacity-90" />
        </ButtonLink>
      ) : null}

      {showSecondary ? (
        <ButtonLink
          href={secondaryCta.href}
          variant="outline"
          size="lg"
          className={cn(
            "hero-actions__secondary rounded-full border-border/70 bg-transparent px-7 hover:border-accent/40 hover:bg-surface/30",
            FOCUS_RING_CLASS,
          )}
        >
          {secondaryCta.label}
          <Download size={18} aria-hidden className="opacity-80" />
        </ButtonLink>
      ) : null}
    </div>
  );
}
