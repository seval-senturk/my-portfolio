"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToTopProps {
  enabled: boolean;
}

export function ScrollToTop({ enabled }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`site-footer__scroll-top${visible ? " site-footer__scroll-top--visible" : ""}`}
      aria-label="Back to top"
    >
      <ChevronUp size={18} aria-hidden />
    </button>
  );
}
