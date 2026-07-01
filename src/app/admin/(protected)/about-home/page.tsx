import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";

export default function AdminAboutHomeRedirectPage() {
  redirect(ADMIN_ROUTES.about);
}
