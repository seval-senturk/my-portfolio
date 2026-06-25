import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";

interface AdminFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function AdminFormField({
  id,
  label,
  required = false,
  hint,
  error,
  className,
  children,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function AdminFormSection({
  title,
  description,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <section className={cn("admin-surface space-y-4 p-6", className)}>
      <div>
        <h2 className="text-h4 font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface AdminFormActionsProps {
  children: ReactNode;
  className?: string;
}

export function AdminFormActions({ children, className }: AdminFormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
