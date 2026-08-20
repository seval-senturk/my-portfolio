import type { ReactNode } from "react";

import type { AuthUser } from "@/types/auth";

import { AdminShellProvider } from "@/features/admin/context";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";

interface AdminShellProps {
  user: AuthUser;
  children: ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <AdminShellProvider>
      <div className="admin-shell">
        <div className="admin-shell__ambient" aria-hidden="true">
          <span className="admin-shell__orb admin-shell__orb--primary" />
          <span className="admin-shell__orb admin-shell__orb--secondary" />
        </div>

        <div className="admin-shell__layout">
          <AdminSidebar />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <AdminTopbar userName={user.name} userEmail={user.email} />
            <main className="admin-main">{children}</main>
          </div>
        </div>
      </div>
    </AdminShellProvider>
  );
}
