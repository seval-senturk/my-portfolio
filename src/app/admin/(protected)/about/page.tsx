import { aboutContent } from "@/data/about.data";
import { aboutHomeContent } from "@/data/about-home.data";
import { AboutUnifiedAdminView } from "@/features/admin/components/about-unified-admin-view";
import { mapAboutHomeToAdminContent } from "@/repositories/prisma/mappers/about-home.mapper";
import {
  getAboutHomeAdminContent,
  getAboutRecord,
  serializeAboutContentForForm,
  serializeAboutForForm,
} from "@/services/admin";

export default async function AdminAboutPage() {
  const [{ config, featureCards }, aboutRecord] = await Promise.all([
    getAboutHomeAdminContent(),
    getAboutRecord(),
  ]);

  const aboutPage =
    serializeAboutForForm(aboutRecord) ?? serializeAboutContentForForm(aboutContent);

  const resolvedAboutHome = config
    ? mapAboutHomeToAdminContent(config, featureCards)
    : aboutHomeContent;

  const aboutHomeWithFallback = {
    ...resolvedAboutHome,
    featureCards:
      resolvedAboutHome.featureCards.length > 0
        ? resolvedAboutHome.featureCards
        : [...aboutHomeContent.featureCards],
  };

  return (
    <AboutUnifiedAdminView aboutHome={aboutHomeWithFallback} aboutPage={aboutPage} />
  );
}
