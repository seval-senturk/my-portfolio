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
      <div className="admin-shell min-h-screen bg-background">
        <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[auto_1fr]">
          <AdminSidebar />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <AdminTopbar userName={user.name} userEmail={user.email} />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminShellProvider>
  );
}
