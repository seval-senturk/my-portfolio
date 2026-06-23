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
        "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
        className,
      )}
    >
      <div>{content}</div>
      <div>{media}</div>
    </div>
  );
}
