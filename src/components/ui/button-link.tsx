import NextLink from "next/link";
import { type ComponentProps } from "react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "@/types/ui";
import {
  BUTTON_BASE_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
} from "@/components/ui/button-styles";

interface ButtonLinkProps extends Omit<
  ComponentProps<typeof NextLink>,
  "className"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <NextLink
      className={cn(
        BUTTON_BASE_CLASSES,
        variant !== "link" && FOCUS_RING_CLASS,
        BUTTON_VARIANT_CLASSES[variant],
        BUTTON_SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
