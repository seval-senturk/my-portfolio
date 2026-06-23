import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "@/types/ui";

import { Icon } from "@/components/ui/icon";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
  secondary: "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/70",
  outline:
    "border border-border bg-surface text-foreground hover:bg-muted active:bg-muted/80",
  ghost: "text-foreground hover:bg-muted active:bg-muted/80",
  link: "text-accent underline-offset-4 hover:underline active:text-accent/80",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-small",
  md: "h-10 gap-2 px-4 text-body",
  lg: "h-12 gap-2.5 px-6 text-body-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-base",
        "disabled:pointer-events-none disabled:opacity-50",
        variant !== "link" && FOCUS_RING_CLASS,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Icon icon={Loader2} size="sm" className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
