import { AuditLogView } from "@/features/admin/components/audit-log-view";
import { listAuditLogs } from "@/repositories/prisma/audit.repository";

export default async function AdminAuditLogPage() {
  const { items, total } = await listAuditLogs({ limit: 100 });

  return <AuditLogView logs={items} total={total} />;
}

