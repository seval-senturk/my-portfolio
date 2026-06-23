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
        "rounded-md text-body font-semibold tracking-tight text-foreground transition-base hover:text-foreground/80",
        FOCUS_RING_CLASS,
        className,
      )}
      aria-label={`${brandConfig.name} — Home`}
    >
      <span className="sm:hidden" aria-hidden>
        {brandConfig.shortName}
      </span>
      <span className="hidden sm:inline">{brandConfig.name}</span>
    </NextLink>
  );
}
