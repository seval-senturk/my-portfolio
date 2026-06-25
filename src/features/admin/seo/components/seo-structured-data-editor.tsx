"use client";

import { useTransition } from "react";

import { saveStructuredDataRuleAction } from "@/features/admin/actions/seo.actions";
import type { SeoStructuredDataRuleRecord } from "@/types/seo-management";
import { AdminSwitchField } from "@/features/admin/ui";

interface SeoStructuredDataEditorProps {
  rules: SeoStructuredDataRuleRecord[];
}

export function SeoStructuredDataEditor({ rules }: SeoStructuredDataEditorProps) {
  const [, startTransition] = useTransition();

  return (
    <div className="admin-surface overflow-hidden rounded-xl border">
      <table className="min-w-full text-left text-small">
        <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">Schema</th>
            <th className="px-5 py-3 font-medium">Scope</th>
            <th className="px-5 py-3 font-medium">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-t border-border">
              <td className="px-5 py-3 font-medium">{rule.label}</td>
              <td className="px-5 py-3 text-muted-foreground">{rule.scope}</td>
              <td className="px-5 py-3">
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      await saveStructuredDataRuleAction(formData);
                    });
                  }}
                >
                  <input type="hidden" name="schemaType" value={rule.schemaType} />
                  <AdminSwitchField
                    id={`enabled-${rule.schemaType}`}
                    name="enabled"
                    label="Enabled"
                    defaultChecked={rule.enabled}
                  />
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
