import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type FeatureGridColumns = 1 | 2 | 3;

const COLUMN_CLASSES: Record<FeatureGridColumns, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

interface FeatureGridProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  columns?: FeatureGridColumns;
}

export function FeatureGrid({
  children,
  columns = 3,
  className,
  ...props
}: FeatureGridProps) {
  return (
    <ul
      className={cn("grid gap-4", COLUMN_CLASSES[columns], className)}
      {...props}
    >
      {children}
    </ul>
  );
}
