import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

export interface AdminSelectOption {
  value: string;
  label: string;
}

interface AdminSelectFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: readonly AdminSelectOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function AdminSelectField({
  id,
  label,
  hint,
  error,
  required,
  options,
  value,
  defaultValue,
  name,
  disabled,
  onChange,
}: AdminSelectFieldProps) {
  return (
    <AdminFormField
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      <select
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          "w-full rounded-lg border bg-surface px-3 py-2 text-body text-foreground transition-base",
          FOCUS_RING_CLASS,
          error ? "border-error" : "border-border",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </AdminFormField>
  );
}
