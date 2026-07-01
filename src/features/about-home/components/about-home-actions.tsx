import { Download, MessageCircle } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import type { AboutHomeContent } from "@/types/about-home";
import { ButtonLink } from "@/components/ui/button-link";

interface AboutHomeActionsProps {
  actions: AboutHomeContent["actions"];
}

export function AboutHomeActions({ actions }: AboutHomeActionsProps) {
  const { primary, secondary } = actions;

  if (!primary.visible && !secondary.visible) {
    return null;
  }

  return (
    <div className="about-home__actions">
      {primary.visible ? (
        <ButtonLink
          href={primary.href}
          variant="primary"
          size="lg"
          className={cn("about-home__action about-home__action--primary", FOCUS_RING_CLASS)}
        >
          {primary.label}
          <Download size={18} aria-hidden className="opacity-90" />
        </ButtonLink>
      ) : null}

      {secondary.visible ? (
        <ButtonLink
          href={secondary.href}
          variant="outline"
          size="lg"
          className={cn(
            "about-home__action about-home__action--secondary rounded-full border-border/70 bg-surface/30 px-7 hover:border-accent/40 hover:bg-surface/50",
            FOCUS_RING_CLASS,
          )}
        >
          {secondary.label}
          <MessageCircle size={18} aria-hidden className="opacity-80" />
        </ButtonLink>
      ) : null}
    </div>
  );
}
