import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminSessionProvider } from "@/features/admin/components/admin-session-provider";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminRootLayoutProps {
  children: ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
