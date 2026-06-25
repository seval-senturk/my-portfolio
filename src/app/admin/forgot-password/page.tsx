import type { Metadata } from "next";

import { AdminForgotPasswordForm } from "@/features/admin/components/admin-forgot-password-form";
import { AdminLoginLayout } from "@/features/admin/components/admin-login-layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return (
    <AdminLoginLayout>
      <AdminForgotPasswordForm />
    </AdminLoginLayout>
  );
}
