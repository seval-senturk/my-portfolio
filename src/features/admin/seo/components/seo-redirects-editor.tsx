"use client";

import { useState, useTransition } from "react";

import {
  deleteRedirectAction,
  saveRedirectAction,
} from "@/features/admin/actions/seo.actions";
import type { SeoRedirectRecord } from "@/types/seo-management";
import { AdminFormStatus } from "@/features/admin/components/admin-form-status";
import { adminTr } from "@/features/admin/i18n/tr";
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
              ? { success: adminTr.common.saved }
              : { error: result.error ?? adminTr.common.saveFailed },
            );
          });
        }}
        className="admin-surface space-y-6 rounded-xl border p-6"
      >
        <AdminFormSection title={adminTr.seo.redirects.addEdit}>
          <AdminTextField id="id" name="id" label="Redirect ID (optional edit)" />
          <AdminTextField id="fromPath" name="fromPath" label="From path" required />
          <AdminTextField id="toPath" name="toPath" label="To path or URL" required />
          <AdminSelectField
            id="statusCode"
            name="statusCode"
            label="Status code"
            defaultValue="PERMANENT_301"
            options={[
              { value: "PERMANENT_301", label: adminTr.seo.redirects.types.permanent301 },
              { value: "TEMPORARY_302", label: adminTr.seo.redirects.types.temporary302 },
              { value: "TEMPORARY_307", label: adminTr.seo.redirects.types.temporary307 },
              { value: "PERMANENT_308", label: adminTr.seo.redirects.types.permanent308 },
            ]}
          />
          <AdminSwitchField id="isActive" name="isActive" label={adminTr.common.active} defaultChecked />
          <AdminTextField id="note" name="note" label={adminTr.common.note} />
        </AdminFormSection>
        <AdminFormStatus error={status.error} success={status.success} />
        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isPending}>
            {adminTr.seo.saveRedirect}
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
              <th className="px-5 py-3 font-medium">{adminTr.common.active}</th>
              <th className="px-5 py-3 font-medium">{adminTr.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((redirect) => (
              <tr key={redirect.id} className="border-t border-border">
                <td className="px-5 py-3 font-mono text-caption">{redirect.fromPath}</td>
                <td className="px-5 py-3 font-mono text-caption">{redirect.toPath}</td>
                <td className="px-5 py-3">{redirect.statusCode.replace("_", " ")}</td>
                <td className="px-5 py-3">{redirect.isActive ? adminTr.common.yes : adminTr.common.no}</td>
                <td className="px-5 py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(redirect.id)}
                  >
                    {adminTr.common.delete}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminConfirmDialog
        isOpen={Boolean(deleteId)}
        title={adminTr.seo.redirects.deleteTitle}
        description={adminTr.seo.redirects.deleteDesc}
        confirmLabel={adminTr.common.delete}
        onConfirm={() => {
          if (!deleteId) return;
          const formData = new FormData();
          formData.set("id", deleteId);
          startTransition(async () => {
            const result = await deleteRedirectAction(formData);
            setStatus(
              result.success
                ? { success: adminTr.common.deleted }
                : { error: result.error ?? adminTr.common.deleteFailed },
            );
            setDeleteId(null);
          });
        }}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
