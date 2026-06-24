import type { UserRole } from "@/types/auth";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 4,
  EDITOR: 3,
  CONTRIBUTOR: 2,
  VIEWER: 1,
};

export const ADMIN_AREA_ROLES: readonly UserRole[] = ["ADMIN"] as const;

export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccessAdminArea(role: UserRole): boolean {
  return ADMIN_AREA_ROLES.includes(role);
}

export function isAdminRole(role: UserRole): boolean {
  return role === "ADMIN";
}
