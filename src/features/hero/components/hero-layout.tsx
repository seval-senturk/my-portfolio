import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface HeroLayoutProps {
  content: ReactNode;
  media: ReactNode;
  aside?: ReactNode;
  className?: string;
}

export function HeroLayout({ content, media, aside, className }: HeroLayoutProps) {
  return (
    <div
      className={cn(
        "hero-layout grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_auto] lg:items-end lg:gap-10 xl:gap-12",
        className,
      )}
    >
      <div className="hero-layout__content order-2 lg:order-1">{content}</div>
      <div className="hero-layout__media order-1 lg:order-2">{media}</div>
      {aside ? (
        <div className="hero-layout__aside order-3 hidden lg:flex">{aside}</div>
      ) : null}
    </div>
  );
}
