import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { BadgeVariant } from "@/types/ui";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-muted text-foreground",
  outline: "border border-border bg-surface text-foreground",
  accent: "bg-accent/10 text-accent",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-caption",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
