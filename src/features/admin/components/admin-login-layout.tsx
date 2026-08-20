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
    <div className="admin-login-page">
      <div className="admin-login-page__ambient" aria-hidden="true">
        <span className="admin-login-page__orb admin-login-page__orb--primary" />
        <span className="admin-login-page__orb admin-login-page__orb--secondary" />
      </div>

      <div className="admin-login-page__inner">
        <div className="admin-login-card">
          <header className="admin-login-card__header">
            <AdminBrandLogo size="lg" />
            <p className="admin-login-card__site-name">{siteConfig.name}</p>
            <p className="admin-login-card__subtitle">{adminTr.login.brandSubtitle}</p>
          </header>

          <div className="admin-login-card__body">
            {children ?? <AdminLoginForm enableGoogleAuth={enableGoogleAuth} />}
          </div>
        </div>
      </div>
    </div>
  );
}
