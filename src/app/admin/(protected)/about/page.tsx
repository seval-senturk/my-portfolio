export const dynamic = "force-dynamic";

import {
  getAboutRecord,
  serializeAboutForForm,
} from "@/services/admin";
import { AboutAdminView } from "@/features/admin/components/about-admin-view";

export default async function AdminAboutPage() {
  const record = await getAboutRecord();
  const initial = serializeAboutForForm(record);

  return (
    <AboutAdminView
      initial={
        initial ?? {
          sectionTitle: "",
          sectionDescription: "",
          introductionParagraphs: "",
          storyTitle: "",
          storyParagraphs: "",
        }
      }
    />
  );
}
