"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { useSectionScrollSpy } from "@/hooks/use-section-scroll-spy";
import {
  parseSectionHash,
  smoothScrollToSection,
  updateSectionHash,
} from "@/lib/scroll/section-scroll";

interface SectionNavContextValue {
  activeSectionId: string | null;
  isOnePageActive: boolean;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string, options?: { pushHash?: boolean }) => void;
}

const SectionNavContext = createContext<SectionNavContextValue | null>(null);

export function useSectionNav(): SectionNavContextValue {
  const context = useContext(SectionNavContext);
  if (!context) {
    throw new Error("useSectionNav must be used within SectionNavProvider");
  }
  return context;
}

interface SectionNavProviderProps {
  children: ReactNode;
}

export function SectionNavProvider({ children }: SectionNavProviderProps) {
  const pathname = usePathname();
  const isOnePageActive = pathname === ROUTES.home;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const activeSectionId = useSectionScrollSpy(isOnePageActive && !isMenuOpen);
  const isProgrammaticScroll = useRef(false);
  const hasHandledInitialHash = useRef(false);
  const hasUserScrolled = useRef(false);

  const scrollToSection = useCallback(
    (sectionId: string, options?: { pushHash?: boolean }) => {
      isProgrammaticScroll.current = true;
      smoothScrollToSection(sectionId);
      updateSectionHash(sectionId, options?.pushHash !== true);

      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 900);
    },
    [],
  );

  useEffect(() => {
    if (!isOnePageActive) {
      hasHandledInitialHash.current = false;
      hasUserScrolled.current = false;
      return;
    }

    if (typeof history !== "undefined") {
      history.scrollRestoration = "manual";
    }

    const markUserScrolled = () => {
      hasUserScrolled.current = true;
    };

    window.addEventListener("scroll", markUserScrolled, { passive: true });
    window.addEventListener("wheel", markUserScrolled, { passive: true });
    window.addEventListener("touchmove", markUserScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", markUserScrolled);
      window.removeEventListener("wheel", markUserScrolled);
      window.removeEventListener("touchmove", markUserScrolled);
    };
  }, [isOnePageActive]);

  useEffect(() => {
    if (!isOnePageActive) {
      hasHandledInitialHash.current = false;
      return;
    }

    const hash = parseSectionHash(window.location.hash);

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      hasHandledInitialHash.current = true;
      return;
    }

    if (hasHandledInitialHash.current) {
      return;
    }

    hasHandledInitialHash.current = true;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const timeoutId = window.setTimeout(() => {
      isProgrammaticScroll.current = true;
      smoothScrollToSection(hash, { instant: true });

      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 150);
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [isOnePageActive]);

  useEffect(() => {
    if (
      !isOnePageActive ||
      !activeSectionId ||
      isProgrammaticScroll.current ||
      isMenuOpen ||
      !hasUserScrolled.current
    ) {
      return;
    }

    updateSectionHash(activeSectionId, true);
  }, [activeSectionId, isOnePageActive, isMenuOpen]);

  const value = useMemo(
    () => ({
      activeSectionId,
      isOnePageActive,
      isMenuOpen,
      setMenuOpen,
      scrollToSection,
    }),
    [activeSectionId, isOnePageActive, isMenuOpen, scrollToSection],
  );

  return <SectionNavContext.Provider value={value}>{children}</SectionNavContext.Provider>;
}
