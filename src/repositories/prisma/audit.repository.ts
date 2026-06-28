import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { AuditActionCategory as PrismaAuditActionCategory } from "@prisma/client";

import type { AuditLogInput, AuditLogRecord } from "@/types/platform";

function toJson(value: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  if (!value) {
    return undefined;
  }

  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function mapRecord(record: {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  category: PrismaAuditActionCategory;
  entityType: string | null;
  entityId: string | null;
  summary: string;
  metadata: unknown;
  createdAt: Date;
}): AuditLogRecord {
  return {
    id: record.id,
    userId: record.userId,
    userEmail: record.userEmail,
    action: record.action,
    category: record.category,
    entityType: record.entityType,
    entityId: record.entityId,
    summary: record.summary,
    metadata: (record.metadata as Record<string, unknown> | null) ?? null,
    createdAt: record.createdAt,
  };
}

export async function createAuditLog(input: AuditLogInput): Promise<AuditLogRecord> {
  const record = await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      userEmail: input.userEmail ?? null,
      action: input.action,
      category: input.category ?? "SYSTEM",
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      summary: input.summary,
      metadata: toJson(input.metadata),
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });

  return mapRecord(record);
}

export async function listAuditLogs(options: {
  limit?: number;
  offset?: number;
  category?: PrismaAuditActionCategory;
} = {}): Promise<{ items: AuditLogRecord[]; total: number }> {
  const limit = Math.min(100, options.limit ?? 50);
  const offset = options.offset ?? 0;

  const where = options.category ? { category: options.category } : undefined;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    items: items.map(mapRecord),
    total,
  };
}
