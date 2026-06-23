import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { HeadingLevel } from "@/types/ui";
import { responsiveTypography } from "@/styles/tokens/typography";

const LEVEL_CLASSES: Record<HeadingLevel | "display", string> = {
  display: responsiveTypography.display,
  h1: responsiveTypography.h1,
  h2: responsiveTypography.h2,
  h3: responsiveTypography.h3,
  h4: responsiveTypography.h4,
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as: HeadingLevel;
  variant?: HeadingLevel | "display";
  children: ReactNode;
}

export function Heading({
  as,
  variant,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = as;
  const visualVariant = variant ?? as;

  return (
    <Component
      className={cn("text-foreground", LEVEL_CLASSES[visualVariant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
