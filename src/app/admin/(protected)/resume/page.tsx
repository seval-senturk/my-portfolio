export const dynamic = "force-dynamic";

import {
  getResumeRecord,
  serializeResumeForForm,
} from "@/services/admin";
import { ResumeAdminView } from "@/features/admin/components/resume-admin-view";

export default async function AdminResumePage() {
  const record = await getResumeRecord();
  const initial = serializeResumeForForm(record);

  return (
    <ResumeAdminView
      initial={
        initial ?? {
          sectionTitle: "",
          sectionDescription: "",
          profileSummary: "",
          profileTitle: "",
          profileLocation: "",
          contentUpdatedAt: new Date().toISOString().slice(0, 10),
        }
      }
    />
  );
}
