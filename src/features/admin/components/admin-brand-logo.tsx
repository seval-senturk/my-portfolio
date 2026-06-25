"use client";

import { cn } from "@/lib/cn";

interface AdminBrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-base",
  md: "h-11 w-11 text-lg",
  lg: "h-14 w-14 text-xl",
} as const;

export function AdminBrandLogo({ size = "md", className }: AdminBrandLogoProps) {
  return (
    <div
      className={cn(
        "admin-brand-logo flex shrink-0 items-center justify-center rounded-xl font-semibold shadow-md",
        SIZE_CLASSES[size],
        className,
      )}
      aria-hidden
    >
      S
    </div>
  );
}
