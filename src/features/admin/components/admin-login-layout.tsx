import type { ReactNode } from "react";

import { siteConfig } from "@/config/site.config";

import { AdminBrandLogo } from "@/features/admin/components/admin-brand-logo";
import { AdminLoginForm } from "@/features/admin/components/admin-login-form";
import { adminTr } from "@/features/admin/i18n/tr";

interface AdminLoginLayoutProps {
  children?: ReactNode;
  enableGoogleAuth?: boolean;
}

export function AdminLoginLayout({
  children,
  enableGoogleAuth = false,
}: AdminLoginLayoutProps) {
  return (
    <div className="admin-login-page min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="admin-login-card w-full max-w-md p-8 sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <AdminBrandLogo size="lg" />
            <p className="mt-4 text-caption font-medium tracking-wide text-muted-foreground uppercase">
              {siteConfig.name}
            </p>
            <p className="mt-1 text-small text-muted-foreground">
              {adminTr.login.brandSubtitle}
            </p>
          </div>

          {children ?? <AdminLoginForm enableGoogleAuth={enableGoogleAuth} />}
        </div>
      </div>
    </div>
  );
}
