import NextLink from "next/link";

import { brandConfig } from "@/config/navigation.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

interface HeaderBrandProps {
  className?: string;
}

export function HeaderBrand({ className }: HeaderBrandProps) {
  return (
    <NextLink
      href={brandConfig.href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-lg transition-base",
        FOCUS_RING_CLASS,
        className,
      )}
      aria-label={`${brandConfig.name} — Home`}
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-surface/80 text-small font-semibold text-foreground transition-base group-hover:border-accent/40"
      >
        {brandConfig.shortName}
      </span>
      <span className="hidden font-medium tracking-tight text-foreground sm:inline">
        {brandConfig.name}
      </span>
    </NextLink>
  );
}
