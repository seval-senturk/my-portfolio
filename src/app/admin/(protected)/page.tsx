import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminIndexPage() {
  redirect(ADMIN_ROUTES.dashboard);
}
