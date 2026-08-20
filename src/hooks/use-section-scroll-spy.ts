"use client";

import { useEffect, useState } from "react";

import {
  ONE_PAGE_SECTION_IDS,
  SECTION_IDS,
  SECTION_SCROLL_OFFSET_PX,
} from "@/constants/sections";

export function useSectionScrollSpy(enabled: boolean): string | null {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveSectionId(null);
      return;
    }

    const sectionElements = ONE_PAGE_SECTION_IDS.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });

    if (sectionElements.length === 0) {
      return;
    }

    if (window.scrollY <= SECTION_SCROLL_OFFSET_PX) {
      setActiveSectionId(SECTION_IDS.hero);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveSectionId(visibleEntries[0].target.id);
          return;
        }

        const scrollPosition = window.scrollY + SECTION_SCROLL_OFFSET_PX + 1;
        let currentId: string | null = sectionElements[0]?.id ?? null;

        for (const element of sectionElements) {
          if (element.offsetTop <= scrollPosition) {
            currentId = element.id;
          }
        }

        setActiveSectionId(currentId);
      },
      {
        rootMargin: `-${SECTION_SCROLL_OFFSET_PX}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.5, 0.75],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [enabled]);

  return activeSectionId;
}
