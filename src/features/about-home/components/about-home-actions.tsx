import { ArrowUpRight, Download } from "lucide-react";

import type { AboutHomeCta } from "@/types/about-home";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button-link";

interface AboutHomeActionsProps {
  primaryCta: AboutHomeCta;
  secondaryCta: AboutHomeCta;
}

export function AboutHomeActions({ primaryCta, secondaryCta }: AboutHomeActionsProps) {
  const showPrimary = primaryCta.visible && primaryCta.label && primaryCta.href;
  const showSecondary =
    secondaryCta.visible && secondaryCta.label && secondaryCta.href;

  if (!showPrimary && !showSecondary) {
    return null;
  }

  return (
    <div className="about-home__actions">
      {showPrimary ? (
        <ButtonLink
          href={primaryCta.href}
          variant="primary"
          size="lg"
          className={cn(
            "about-home__actions-primary !rounded-[1rem] px-7 shadow-[0_12px_32px_rgba(124,131,255,0.24)]",
            FOCUS_RING_CLASS,
          )}
        >
          {primaryCta.label}
          <ArrowUpRight size={18} aria-hidden className="opacity-90" />
        </ButtonLink>
      ) : null}

      {showSecondary ? (
        <ButtonLink
          href={secondaryCta.href}
          variant="outline"
          size="lg"
          className={cn(
            "about-home__actions-secondary !rounded-[1rem] bg-transparent px-7 hover:bg-surface/30",
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
