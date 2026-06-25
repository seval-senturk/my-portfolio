import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

interface AdminSwitchFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function AdminSwitchField({
  id,
  label,
  hint,
  error,
  name,
  checked,
  defaultChecked,
  disabled,
  onChange,
}: AdminSwitchFieldProps) {
  return (
    <AdminFormField id={id} label={label} hint={hint} error={error}>
      <label
        htmlFor={id}
        className={cn(
          "inline-flex cursor-pointer items-center gap-3 text-small text-muted-foreground",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          role="switch"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
          className={cn("h-4 w-4 rounded border-border", FOCUS_RING_CLASS)}
        />
        Toggle
      </label>
    </AdminFormField>
  );
}
