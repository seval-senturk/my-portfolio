"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { headerCta, mainNavigation } from "@/config/navigation.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { isActiveRoute } from "@/lib/navigation";

import { NavLink } from "@/features/layout/components/nav-link";
import { ButtonLink } from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-base hover:bg-muted",
          FOCUS_RING_CLASS,
        )}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Icon icon={isOpen ? X : Menu} size="md" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
            aria-label="Close menu overlay"
            onClick={closeMenu}
          />
          <div
            ref={panelRef}
            id={panelId}
            className="fixed inset-x-0 top-14 z-50 border-b border-border bg-surface/95 shadow-lg backdrop-blur-md lg:top-16"
          >
            <nav aria-label="Mobile navigation" className="px-4 py-4">
              <ul className="flex flex-col gap-1">
                {mainNavigation.map((item) => {
                  const active = isActiveRoute(pathname, item.href);

                  return (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        className={cn(
                          "block w-full px-3 py-3",
                          active && "bg-muted",
                        )}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 border-t border-border pt-4 sm:hidden">
                <ButtonLink
                  href={headerCta.href}
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={closeMenu}
                >
                  {headerCta.label}
                </ButtonLink>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
