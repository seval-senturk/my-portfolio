import { aboutContent } from "@/data/about.data";
import { aboutHomeContent } from "@/data/about-home.data";
import { AboutUnifiedAdminView } from "@/features/admin/components/about-unified-admin-view";
import { mapAboutHomeToContent } from "@/repositories/prisma/mappers/about-home.mapper";
import {
  getAboutHomeConfig,
  getAboutRecord,
  listAboutHomeQuickInfo,
  listAboutHomeStats,
  serializeAboutContentForForm,
  serializeAboutForForm,
} from "@/services/admin";

export default async function AdminAboutPage() {
  const [aboutRecord, aboutHomeConfig, quickInfo, stats] = await Promise.all([
    getAboutRecord(),
    getAboutHomeConfig(),
    listAboutHomeQuickInfo(),
    listAboutHomeStats(),
  ]);

  const aboutPage =
    serializeAboutForForm(aboutRecord) ?? serializeAboutContentForForm(aboutContent);

  const resolvedAboutHome = aboutHomeConfig
    ? mapAboutHomeToContent(aboutHomeConfig, quickInfo, stats)
    : aboutHomeContent;

  return (
    <AboutUnifiedAdminView aboutHome={resolvedAboutHome} aboutPage={aboutPage} />
  );
}
