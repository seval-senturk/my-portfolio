import type { Prisma } from "@prisma/client";

export function fromJson<T>(value: unknown): T {
  return value as T;
}

export function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
