import { A11Y, FOCUS_RING_CLASS } from "@/lib/accessibility";

export function SkipLink() {
  return (
    <a
      href={`#${A11Y.skipLinkTarget}`}
      className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md ${FOCUS_RING_CLASS}`}
    >
      {A11Y.skipLinkLabel}
    </a>
  );
}
