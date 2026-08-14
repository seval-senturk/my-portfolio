import { ContactAdminView } from "@/features/admin/components/contact-admin-view";
import { getContactConfigForAdmin } from "@/services/admin/contact.admin.service";

export default async function AdminContactPage() {
  const config = await getContactConfigForAdmin();

  return <ContactAdminView initial={config} />;
}
