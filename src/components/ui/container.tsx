import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ContainerSize } from "@/types/ui";

const SIZE_CLASSES: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  children: ReactNode;
}

export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
