import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface HeroLayoutProps {
  content: ReactNode;
  media: ReactNode;
  className?: string;
}

export function HeroLayout({ content, media, className }: HeroLayoutProps) {
  return (
    <div
      className={cn(
        "hero-layout grid w-full gap-12 lg:grid-cols-2 lg:gap-16",
        className,
      )}
    >
      <div className="hero-layout__content order-2 lg:order-1">{content}</div>
      <div className="hero-layout__media order-1 lg:order-2">{media}</div>
    </div>
  );
}
