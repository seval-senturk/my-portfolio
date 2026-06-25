import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth, isGoogleOAuthConfigured } from "@/auth";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { canAccessAdminArea } from "@/lib/auth/permissions";

import { AdminLoginLayout } from "@/features/admin/components/admin-login-layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Giriş",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role && canAccessAdminArea(session.user.role)) {
    redirect(ADMIN_ROUTES.dashboard);
  }

  return <AdminLoginLayout enableGoogleAuth={isGoogleOAuthConfigured()} />;
}
