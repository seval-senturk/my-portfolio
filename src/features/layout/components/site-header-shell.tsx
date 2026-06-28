"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

interface SiteHeaderShellProps {
  children: ReactNode;
}

export function SiteHeaderShell({ children }: SiteHeaderShellProps) {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.home;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSolidHeader = scrolled || !isHome;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        showSolidHeader
          ? "border-b border-border/50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
