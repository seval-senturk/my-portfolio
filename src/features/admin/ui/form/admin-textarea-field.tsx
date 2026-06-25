import type { TextareaHTMLAttributes } from "react";

import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { Textarea } from "@/components/ui/textarea";

interface AdminTextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function AdminTextareaField({
  id,
  label,
  hint,
  error,
  required,
  ...textareaProps
}: AdminTextareaFieldProps) {
  return (
    <AdminFormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <Textarea
        id={id}
        hasError={Boolean(error)}
        required={required}
        {...textareaProps}
      />
    </AdminFormField>
  );
}
