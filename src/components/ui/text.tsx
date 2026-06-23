import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { TextTone, TextVariant } from "@/types/ui";
import { responsiveTypography } from "@/styles/tokens/typography";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  "body-large": responsiveTypography.bodyLarge,
  body: responsiveTypography.body,
  small: responsiveTypography.small,
  caption: responsiveTypography.caption,
};

const TONE_CLASSES: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  tone?: TextTone;
  as?: "p" | "span" | "div";
  children: ReactNode;
}

export function Text({
  variant = "body",
  tone = "default",
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(VARIANT_CLASSES[variant], TONE_CLASSES[tone], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
