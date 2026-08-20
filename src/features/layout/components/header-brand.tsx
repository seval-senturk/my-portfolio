"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { brandConfig } from "@/config/navigation.config";
import { SECTION_IDS } from "@/constants/sections";
import { ROUTES } from "@/constants/routes";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { useSectionNav } from "@/features/layout/context/section-nav-context";

interface HeaderBrandProps {
  className?: string;
}

export function HeaderBrand({ className }: HeaderBrandProps) {
  const pathname = usePathname();
  const { scrollToSection, isOnePageActive } = useSectionNav();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isOnePageActive) {
      return;
    }

    event.preventDefault();
    scrollToSection(SECTION_IDS.hero, { pushHash: true });
  }

  return (
    <NextLink
      href={brandConfig.href}
      prefetch={pathname === ROUTES.home}
      onClick={handleClick}
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
      <span className="font-medium tracking-tight text-foreground">
        {brandConfig.name}
      </span>
    </NextLink>
  );
}
