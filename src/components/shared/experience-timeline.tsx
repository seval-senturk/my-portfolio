import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ExperienceTimelineProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function ExperienceTimeline({
  children,
  className,
  "aria-label": ariaLabel = "Career timeline",
}: ExperienceTimelineProps) {
  return (
    <ol className={cn("space-y-10", className)} aria-label={ariaLabel}>
      {children}
    </ol>
  );
}

interface ExperienceTimelineItemProps {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
}

export function ExperienceTimelineItem({
  children,
  className,
  isLast = false,
}: ExperienceTimelineItemProps) {
  return (
    <li
      className={cn(
        "relative border-l-2 border-border pl-6 sm:pl-8",
        !isLast && "pb-2",
        className,
      )}
    >
      <span
        className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-surface"
        aria-hidden
      />
      {children}
    </li>
  );
}
