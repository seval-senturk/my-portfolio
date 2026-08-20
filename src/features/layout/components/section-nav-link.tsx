"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps, type MouseEvent } from "react";

import { ROUTES } from "@/constants/routes";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { useSectionNav } from "@/features/layout/context/section-nav-context";
import { parseSectionHash } from "@/lib/scroll/section-scroll";
import type { NavigationItem } from "@/types/navigation";

interface SectionNavLinkProps extends Omit<ComponentProps<typeof NextLink>, "href"> {
  item: NavigationItem;
  className?: string;
  activeClassName?: string;
  /** Called after a section link is activated; receives target section id when on home. */
  onNavigate?: (sectionId?: string) => void;
}

export function SectionNavLink({
  item,
  className,
  activeClassName,
  onNavigate,
  children,
  ...props
}: SectionNavLinkProps) {
  const pathname = usePathname();
  const { activeSectionId, isOnePageActive, scrollToSection } = useSectionNav();

  const sectionId = item.sectionId ?? parseSectionHash(item.href);
  const isHashLink = item.href.startsWith("/#") || item.href.startsWith("#");
  const isActive =
    isOnePageActive && sectionId
      ? activeSectionId === sectionId
      : pathname === item.href || (item.href !== ROUTES.home && pathname.startsWith(item.href));

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!sectionId || !isHashLink) {
      onNavigate?.();
      return;
    }

    if (pathname === ROUTES.home) {
      event.preventDefault();

      if (onNavigate) {
        onNavigate(sectionId);
        return;
      }

      scrollToSection(sectionId, { pushHash: true });
      return;
    }

    onNavigate?.();
  }

  return (
    <NextLink
      href={item.href}
      prefetch={pathname === ROUTES.home}
      aria-current={isActive ? "true" : undefined}
      onClick={handleClick}
      className={cn(
        "section-nav-link",
        FOCUS_RING_CLASS,
        isActive && "section-nav-link--active",
        isActive && activeClassName,
        className,
      )}
      {...props}
    >
      {children ?? item.label}
      {isActive ? <span className="section-nav-link__indicator" aria-hidden /> : null}
    </NextLink>
  );
}
