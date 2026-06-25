"use client";

import { useState, useTransition } from "react";

import {
  deleteRedirectAction,
  saveRedirectAction,
} from "@/features/admin/actions/seo.actions";
import type { SeoRedirectRecord } from "@/types/seo-management";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import {
  AdminConfirmDialog,
  AdminFormSection,
  AdminSelectField,
  AdminSwitchField,
  AdminTextField,
} from "@/features/admin/ui";
import { Button } from "@/components/ui/button";

interface SeoRedirectsEditorProps {
  redirects: SeoRedirectRecord[];
}

export function SeoRedirectsEditor({ redirects }: SeoRedirectsEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await saveRedirectAction(formData);
            setStatus(
            result.success
              ? { success: "Saved successfully." }
              : { error: result.error ?? "Save failed." },
            );
          });
        }}
        className="admin-surface space-y-6 rounded-xl border p-6"
      >
        <AdminFormSection title="Add / Edit Redirect">
          <AdminTextField id="id" name="id" label="Redirect ID (optional edit)" />
          <AdminTextField id="fromPath" name="fromPath" label="From path" required />
          <AdminTextField id="toPath" name="toPath" label="To path or URL" required />
          <AdminSelectField
            id="statusCode"
            name="statusCode"
            label="Status code"
            defaultValue="PERMANENT_301"
            options={[
              { value: "PERMANENT_301", label: "301 Permanent" },
              { value: "TEMPORARY_302", label: "302 Temporary" },
              { value: "TEMPORARY_307", label: "307 Temporary" },
              { value: "PERMANENT_308", label: "308 Permanent" },
            ]}
          />
          <AdminSwitchField id="isActive" name="isActive" label="Active" defaultChecked />
          <AdminTextField id="note" name="note" label="Note" />
        </AdminFormSection>
        <AdminFormStatus error={status.error} success={status.success} />
        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isPending}>
            Save Redirect
          </Button>
        </div>
      </form>

      <div className="admin-surface overflow-hidden rounded-xl border">
        <table className="min-w-full text-left text-small">
          <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">From</th>
              <th className="px-5 py-3 font-medium">To</th>
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Active</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((redirect) => (
              <tr key={redirect.id} className="border-t border-border">
                <td className="px-5 py-3 font-mono text-caption">{redirect.fromPath}</td>
                <td className="px-5 py-3 font-mono text-caption">{redirect.toPath}</td>
                <td className="px-5 py-3">{redirect.statusCode.replace("_", " ")}</td>
                <td className="px-5 py-3">{redirect.isActive ? "Yes" : "No"}</td>
                <td className="px-5 py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(redirect.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete redirect"
        description="This redirect rule will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleteId) return;
          const formData = new FormData();
          formData.set("id", deleteId);
          startTransition(async () => {
            const result = await deleteRedirectAction(formData);
            setStatus(
              result.success
                ? { success: "Deleted successfully." }
                : { error: result.error ?? "Delete failed." },
            );
            setDeleteId(null);
          });
        }}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
