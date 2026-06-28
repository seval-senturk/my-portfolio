"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { adminTr } from "@/features/admin/i18n/tr";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
}

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
}: AdminModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] rounded-xl border border-border bg-surface p-0 shadow-xl backdrop:bg-foreground/40",
        SIZE_CLASSES[size],
        FOCUS_RING_CLASS,
      )}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <div className="flex items-start justify-between border-b border-border px-6 py-4">
        <div>
          <Heading as="h2" id={titleId} variant="h4">
            {title}
          </Heading>
          {description ? (
            <p id={descriptionId} className="mt-1 text-small text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={adminTr.modal.close}
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-6 py-4">{children}</div>
      {footer ? (
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
