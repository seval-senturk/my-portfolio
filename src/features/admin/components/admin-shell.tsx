import type { ReactNode } from "react";

import type { AuthUser } from "@/types/auth";

import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";

interface AdminShellProps {
  user: AuthUser;
  children: ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
        <AdminSidebar />
        <div className="flex min-h-screen flex-col">
          <AdminTopbar userName={user.name} userEmail={user.email} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
