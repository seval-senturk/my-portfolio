import { type LabelHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export function Label({
  children,
  required = false,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn("block text-small font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-error" aria-hidden>
          {" "}
          *
        </span>
      )}
    </label>
  );
}
