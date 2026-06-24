import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { canAccessAdminArea } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

import { AdminShell } from "@/features/admin/components/admin-shell";

interface AdminProtectedLayoutProps {
  children: ReactNode;
}

export default async function AdminProtectedLayout({
  children,
}: AdminProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ADMIN_ROUTES.login);
  }

  if (!canAccessAdminArea(user.role)) {
    redirect(ADMIN_ROUTES.unauthorized);
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
