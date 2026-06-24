import type { UserRole } from "@/types/auth";

export function isUserRole(value: string): value is UserRole {
  return (
    value === "ADMIN" ||
    value === "EDITOR" ||
    value === "CONTRIBUTOR" ||
    value === "VIEWER"
  );
}
