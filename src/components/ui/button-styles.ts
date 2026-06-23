import type { ButtonSize, ButtonVariant } from "@/types/ui";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
  secondary: "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/70",
  outline:
    "border border-border bg-surface text-foreground hover:bg-muted active:bg-muted/80",
  ghost: "text-foreground hover:bg-muted active:bg-muted/80",
  link: "text-accent underline-offset-4 hover:underline active:text-accent/80",
};

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-small",
  md: "h-10 gap-2 px-4 text-body",
  lg: "h-12 gap-2.5 px-6 text-body-lg",
};

export const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center rounded-lg font-medium transition-base";
