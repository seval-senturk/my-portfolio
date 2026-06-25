import type { InputHTMLAttributes } from "react";

import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { Input } from "@/components/ui/input";

interface AdminTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function AdminTextField({
  id,
  label,
  hint,
  error,
  required,
  ...inputProps
}: AdminTextFieldProps) {
  return (
    <AdminFormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <Input id={id} hasError={Boolean(error)} required={required} {...inputProps} />
    </AdminFormField>
  );
}
