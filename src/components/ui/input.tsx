import { type InputHTMLAttributes, forwardRef } from "react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-surface px-3 py-2 text-body text-foreground transition-base placeholder:text-muted-foreground",
        FOCUS_RING_CLASS,
        hasError ? "border-error" : "border-border",
        className,
      )}
      {...props}
    />
  );
});
