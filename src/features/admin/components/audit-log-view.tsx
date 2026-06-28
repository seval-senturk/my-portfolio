"use client";

import type { AuditLogRecord } from "@/types/platform";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { Text } from "@/components/ui/text";

interface AuditLogViewProps {
  logs: AuditLogRecord[];
  total: number;
}

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AuditLogView({ logs, total }: AuditLogViewProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader title={adminTr.audit.title} description={adminTr.audit.description} />

      <Text tone="muted" className="text-caption">
        {total} {adminTr.audit.records}
      </Text>

      <div className="admin-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-small">
          <thead>
            <tr className="border-b border-border text-caption text-muted-foreground">
              <th className="px-4 py-3">{adminTr.audit.columns.when}</th>
              <th className="px-4 py-3">{adminTr.audit.columns.user}</th>
              <th className="px-4 py-3">{adminTr.audit.columns.category}</th>
              <th className="px-4 py-3">{adminTr.audit.columns.summary}</th>
              <th className="px-4 py-3">{adminTr.audit.columns.action}</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {adminTr.audit.empty}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-border/60">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3">{log.userEmail ?? adminTr.common.system}</td>
                  <td className="px-4 py-3">{log.category}</td>
                  <td className="px-4 py-3">{log.summary}</td>
                  <td className="px-4 py-3 text-caption text-muted-foreground">{log.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
