import type { ReactNode } from "react";

import { siteConfig } from "@/config/site.config";

import { AdminLoginForm } from "@/features/admin/components/admin-login-form";

interface AdminLoginLayoutProps {
  children?: ReactNode;
}

export function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="admin-login-pattern admin-login-grid relative hidden flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex">
        <div>
          <p className="text-caption font-medium tracking-[0.24em] uppercase opacity-80">
            {siteConfig.name}
          </p>
          <h2 className="mt-6 max-w-md text-h2 font-semibold tracking-tight">
            Manage your portfolio with clarity and confidence.
          </h2>
          <p className="mt-4 max-w-md text-body-lg text-primary-foreground/80">
            A focused workspace for content, projects, resume updates, and site
            settings — built for daily use.
          </p>
        </div>

        <div className="space-y-3 text-small text-primary-foreground/70">
          <p>Premium admin experience inspired by modern product dashboards.</p>
          <p>Secure access · Neon-backed content · Production-ready workflows</p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        {children ?? <AdminLoginForm />}
      </div>
    </div>
  );
}
