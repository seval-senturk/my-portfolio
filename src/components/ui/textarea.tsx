import { type TextareaHTMLAttributes, forwardRef } from "react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, hasError = false, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-32 w-full resize-y rounded-lg border bg-surface px-3 py-2 text-body text-foreground transition-base placeholder:text-muted-foreground",
          FOCUS_RING_CLASS,
          hasError ? "border-error" : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);
