import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface HeroLayoutProps {
  content: ReactNode;
  media: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function HeroLayout({ content, media, footer, className }: HeroLayoutProps) {
  return (
    <div className={cn("hero-layout", className)}>
      <div className="hero-layout__main">
        <div className="hero-layout__content">{content}</div>
        <div className="hero-layout__media">{media}</div>
      </div>
      {footer ? <div className="hero-layout__footer">{footer}</div> : null}
    </div>
  );
}
