import {
  getResumeRecord,
  serializeResumeForForm,
  serializeResumeFile,
} from "@/services/admin";
import { ensureDefaultResumePdfExists } from "@/lib/resume/pdf-storage";
import { ResumeAdminView } from "@/features/admin/components/resume-admin-view";

export default async function AdminResumePage() {
  await ensureDefaultResumePdfExists();
  const record = await getResumeRecord();
  const initial = serializeResumeForForm(record);
  const resumeFile = serializeResumeFile(record);

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
      resumeFile={resumeFile}
    />
  );
}

