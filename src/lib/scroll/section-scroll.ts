import { SECTION_SCROLL_OFFSET_PX } from "@/constants/sections";

function easeInOutCubic(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getSectionScrollTop(sectionId: string): number | null {
  const element = document.getElementById(sectionId);
  if (!element) {
    return null;
  }

  return element.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET_PX;
}

export function smoothScrollToSection(
  sectionId: string,
  options?: { instant?: boolean },
): void {
  const top = getSectionScrollTop(sectionId);
  if (top === null) {
    return;
  }

  if (options?.instant || prefersReducedMotion()) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  const start = window.scrollY;
  const distance = top - start;
  const duration = Math.min(900, Math.max(450, Math.abs(distance) * 0.55));
  let startTime: number | null = null;
  let frameId = 0;

  function step(currentTime: number) {
    if (startTime === null) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * easeInOutCubic(progress));

    if (progress < 1) {
      frameId = window.requestAnimationFrame(step);
    }
  }

  frameId = window.requestAnimationFrame(step);
}

export function parseSectionHash(hash: string): string | null {
  const id = hash.replace(/^#/, "").trim();
  return id.length > 0 ? id : null;
}

export function updateSectionHash(sectionId: string, replace = true): void {
  const nextHash = `#${sectionId}`;
  if (window.location.hash === nextHash) {
    return;
  }

  const url = `${window.location.pathname}${window.location.search}${nextHash}`;

  if (replace) {
    window.history.replaceState(null, "", url);
  } else {
    window.history.pushState(null, "", url);
  }
}
