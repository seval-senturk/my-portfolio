import { A11Y, FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

export function SkipLink() {
  return (
    <a
      href={`#${A11Y.skipLinkTarget}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50",
        "rounded-lg bg-surface px-4 py-2 text-body text-foreground shadow-md",
        FOCUS_RING_CLASS,
      )}
    >
      {A11Y.skipLinkLabel}
    </a>
  );
}
