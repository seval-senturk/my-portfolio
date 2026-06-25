"use client";

import { Upload } from "lucide-react";

import { AdminFormField } from "@/features/admin/ui/form/admin-form-field";
import { cn } from "@/lib/cn";

interface AdminUploadFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  name?: string;
  accept?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function AdminUploadField({
  id,
  label,
  hint = "Cloudinary Media Library integration coming soon. Enter a URL for now.",
  error,
  name,
  accept = "image/*",
  value,
  defaultValue,
  onChange,
  disabled,
}: AdminUploadFieldProps) {
  return (
    <AdminFormField id={id} label={label} hint={hint} error={error}>
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-muted/40 p-4",
          disabled && "opacity-60",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-surface p-2 text-muted-foreground">
            <Upload className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1 space-y-3">
            <input
              id={id}
              name={name}
              type="url"
              placeholder="https://..."
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={(event) => onChange?.(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-small"
            />
            <input
              type="file"
              accept={accept}
              disabled
              aria-label={`${label} file upload (coming soon)`}
              className="block w-full text-caption text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-caption"
            />
          </div>
        </div>
      </div>
    </AdminFormField>
  );
}
