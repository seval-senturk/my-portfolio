"use client";

import type { AuditLogRecord } from "@/types/platform";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

interface AuditLogViewProps {
  logs: AuditLogRecord[];
  total: number;
}

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AuditLogView({ logs, total }: AuditLogViewProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Log"
        description="Critical admin actions recorded for accountability and troubleshooting."
      />

      <Text tone="muted" className="text-caption">
        {total} record{total === 1 ? "" : "s"}
      </Text>

      <div className="admin-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-small">
          <thead>
            <tr className="border-b border-border text-caption text-muted-foreground">
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No audit entries yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-border/60">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                  <td className="px-4 py-3">{log.userEmail ?? "System"}</td>
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
