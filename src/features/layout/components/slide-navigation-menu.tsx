"use client";

import {
  FileText,
  Menu,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  brandConfig,
  mainNavigation,
  slideMenuConfig,
} from "@/config/navigation.config";
import { SECTION_IDS, type SectionId } from "@/constants/sections";
import { socialLinks } from "@/config/social-links.config";
import { HeroSocialIcon } from "@/features/hero/components/hero-social-icon";
import { SLIDE_NAV_ICONS } from "@/features/layout/config/slide-nav-icons.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { SectionNavLink } from "@/features/layout/components/section-nav-link";
import { useSectionNav } from "@/features/layout/context/section-nav-context";
import { Icon } from "@/components/ui/icon";

const PANEL_CLOSE_MS = 360;

interface SlideNavigationMenuProps {
  availabilityLabel?: string;
  resumeHref?: string;
}

function lockBodyScroll(): () => void {
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
    window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
  };
}

export function SlideNavigationMenu({
  availabilityLabel = slideMenuConfig.availabilityLabel,
  resumeHref = slideMenuConfig.resumeHref,
}: SlideNavigationMenuProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  const pathnameRef = useRef(pathname);
  const { setMenuOpen, scrollToSection } = useSectionNav();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(
    (options?: { scrollToSection?: string }) => {
      clearCloseTimer();
      setIsOpen(false);
      setMenuOpen(false);

      closeTimerRef.current = window.setTimeout(() => {
        setIsMounted(false);
        unlockScrollRef.current?.();
        unlockScrollRef.current = null;

        if (options?.scrollToSection) {
          window.requestAnimationFrame(() => {
            scrollToSection(options.scrollToSection!, { pushHash: true });
          });
        }

        toggleRef.current?.focus({ preventScroll: true });
        closeTimerRef.current = null;
      }, PANEL_CLOSE_MS);
    },
    [clearCloseTimer, scrollToSection, setMenuOpen],
  );

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setMenuOpen(true);

    if (isMounted) {
      setIsOpen(true);
      return;
    }

    setIsMounted(true);

    window.requestAnimationFrame(() => {
      unlockScrollRef.current = lockBodyScroll();
      setIsOpen(true);
    });
  }, [clearCloseTimer, isMounted, setMenuOpen]);

  const handleToggle = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isOpen) {
        closeMenu();
        return;
      }

      openMenu();
    },
    [closeMenu, isOpen, openMenu],
  );

  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;

    if (isMounted || isOpen) {
      closeMenu();
    }
  }, [pathname, isMounted, isOpen, closeMenu]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const frameId = window.requestAnimationFrame(() => {
      const closeButton = panelRef.current?.querySelector<HTMLElement>(
        "[data-slide-nav-close]",
      );
      closeButton?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  useEffect(
    () => () => {
      clearCloseTimer();
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
      setMenuOpen(false);
    },
    [clearCloseTimer, setMenuOpen],
  );

  const menuPortal =
    isMounted && typeof document !== "undefined"
      ? createPortal(
          <div className="slide-nav-root" aria-hidden={!isOpen}>
            <button
              type="button"
              className={cn("slide-nav-backdrop", isOpen && "slide-nav-backdrop--open")}
              aria-label="Close navigation menu"
              onClick={() => closeMenu()}
              tabIndex={isOpen ? 0 : -1}
            />

            <aside
              ref={panelRef}
              id={panelId}
              className={cn("slide-nav-panel", isOpen && "slide-nav-panel--open")}
              aria-label="Site navigation"
              aria-hidden={!isOpen}
              role="dialog"
              aria-modal="true"
            >
              <div className="slide-nav-panel__glow slide-nav-panel__glow--left" aria-hidden />
              <div className="slide-nav-panel__glow slide-nav-panel__glow--right" aria-hidden />

              <div className="slide-nav-panel__inner">
                <header className="slide-nav-panel__header">
                  <button
                    type="button"
                    data-slide-nav-close
                    className={cn("slide-nav-panel__close", FOCUS_RING_CLASS)}
                    onClick={() => closeMenu()}
                  >
                    <span aria-hidden>←</span>
                    {slideMenuConfig.closeLabel}
                  </button>

                  <p className="slide-nav-panel__logo-badge" aria-hidden>
                    {brandConfig.shortName}
                  </p>
                  <p className="slide-nav-panel__name">{brandConfig.name}</p>
                  <p className="slide-nav-panel__role">{slideMenuConfig.role}</p>
                </header>

                <div className="slide-nav-panel__divider" aria-hidden />

                <div className="slide-nav-panel__content">
                  <nav aria-label="Primary">
                    <ul className="slide-nav-panel__list">
                      {mainNavigation.map((item, index) => {
                        const sectionId = item.sectionId as SectionId | undefined;
                        const NavIcon =
                          sectionId && sectionId in SLIDE_NAV_ICONS
                            ? SLIDE_NAV_ICONS[sectionId]
                            : SLIDE_NAV_ICONS[SECTION_IDS.hero];

                        return (
                          <li
                            key={item.sectionId ?? item.href}
                            className={cn(
                              "slide-nav-panel__item",
                              isOpen && "slide-nav-panel__item--visible",
                            )}
                            style={
                              {
                                "--slide-nav-stagger": `${index * 40 + 80}ms`,
                              } as CSSProperties
                            }
                          >
                            <SectionNavLink
                              item={item}
                              className="slide-nav-panel__link"
                              activeClassName="slide-nav-panel__link--active"
                              onNavigate={(sectionId) => {
                                if (sectionId) {
                                  closeMenu({ scrollToSection: sectionId });
                                  return;
                                }

                                closeMenu();
                              }}
                            >
                              <span className="slide-nav-panel__icon" aria-hidden>
                                <NavIcon size={17} strokeWidth={1.75} />
                              </span>
                              <span className="slide-nav-panel__label">{item.label}</span>
                            </SectionNavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                <footer className="slide-nav-panel__footer">
                  <div
                    className="slide-nav-panel__divider slide-nav-panel__divider--footer"
                    aria-hidden
                  />

                  <ul className="slide-nav-panel__social">
                    {socialLinks.map((link) => {
                      const isEmail = link.platform === "email";

                      return (
                        <li key={link.platform}>
                          <a
                            href={link.href}
                            className={cn("slide-nav-panel__social-link", FOCUS_RING_CLASS)}
                            aria-label={link.label}
                            {...(!isEmail && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                          >
                            <span className="slide-nav-panel__social-icon" aria-hidden>
                              <HeroSocialIcon platform={link.platform} size={17} />
                            </span>
                          </a>
                        </li>
                      );
                    })}
                    <li>
                      <NextLink
                        href={resumeHref}
                        className={cn("slide-nav-panel__social-link", FOCUS_RING_CLASS)}
                        aria-label={slideMenuConfig.resumeLabel}
                        onClick={() => closeMenu()}
                      >
                        <span className="slide-nav-panel__social-icon" aria-hidden>
                          <FileText size={17} strokeWidth={1.75} />
                        </span>
                      </NextLink>
                    </li>
                  </ul>

                  <p className="slide-nav-panel__status">
                    <span className="slide-nav-panel__status-dot" aria-hidden />
                    {availabilityLabel}
                  </p>
                </footer>
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={cn("slide-nav-trigger", FOCUS_RING_CLASS)}
        aria-expanded={isOpen}
        aria-controls={isMounted ? panelId : undefined}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={handleToggle}
      >
        <Icon icon={Menu} size="md" />
      </button>

      {menuPortal}
    </>
  );
}
