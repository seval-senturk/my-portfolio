import { Download } from "lucide-react";

import type { HeroCta } from "@/types/hero";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

import { ButtonLink } from "@/components/ui/button-link";

interface HeroActionsProps {
  primaryCta: HeroCta;
}

export function HeroActions({ primaryCta }: HeroActionsProps) {
  return (
    <div className="mt-10">
      <ButtonLink
        href={primaryCta.href}
        variant="outline"
        size="lg"
        className={cn(
          "rounded-full border-border/70 bg-surface/30 px-7 hover:border-accent/40 hover:bg-surface/50",
          FOCUS_RING_CLASS,
        )}
      >
        {primaryCta.label}
        <Download size={18} aria-hidden className="opacity-80" />
      </ButtonLink>
    </div>
  );
}
