import type { Metadata } from "next";
import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminLoginLayout } from "@/features/admin/components/admin-login-layout";
import { AdminResetPasswordForm } from "@/features/admin/components/admin-reset-password-form";
import { adminTr } from "@/features/admin/i18n/tr";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  robots: { index: false, follow: false },
};

interface AdminResetPasswordPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function AdminResetPasswordPage({
  searchParams,
}: AdminResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";
  const email = params.email?.trim().toLowerCase() ?? "";

  if (!token || !email) {
    return (
      <AdminLoginLayout>
        <div className="space-y-4 text-center">
          <h1 className="text-h3 font-semibold">{adminTr.resetPassword.title}</h1>
          <p className="text-small text-error">Geçersiz veya süresi dolmuş sıfırlama bağlantısı.</p>
          <Link
            href={ADMIN_ROUTES.forgotPassword}
            className="inline-block text-small text-[var(--admin-brand,#7c3aed)] hover:underline"
          >
            Yeni bağlantı iste
          </Link>
        </div>
      </AdminLoginLayout>
    );
  }

  return (
    <AdminLoginLayout>
      <AdminResetPasswordForm email={email} token={token} />
    </AdminLoginLayout>
  );
}

