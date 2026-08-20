import type { ButtonSize, ButtonVariant } from "@/types/ui";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 active:bg-primary/85",
  secondary:
    "bg-surface text-foreground ring-1 ring-border/80 hover:bg-muted active:bg-muted/80",
  outline:
    "border border-border/80 bg-transparent text-foreground hover:border-accent/40 hover:bg-accent-muted active:bg-surface",
  ghost: "text-foreground hover:bg-muted/70 active:bg-muted/60",
  link: "text-accent underline-offset-4 hover:underline active:text-accent/80",
};

const SITE_BUTTON_SIZE_CLASSES =
  "h-[var(--site-button-height)] min-h-[var(--site-button-height)] gap-[var(--site-button-gap)] px-[var(--site-button-padding-x)] [font-size:var(--site-button-font-size)] font-medium leading-none";

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-4 [font-size:var(--font-size-small)]",
  md: SITE_BUTTON_SIZE_CLASSES,
  lg: SITE_BUTTON_SIZE_CLASSES,
};

export const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center rounded-[var(--site-button-radius)] font-medium transition-base";
