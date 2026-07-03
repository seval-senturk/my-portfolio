import { siteFooterContent } from "@/data/site-footer.data";
import { FooterAdminView } from "@/features/admin/components/footer-admin-view";
import {
  mapFooterAdminLinks,
  mapFooterConfigToAdminContent,
} from "@/repositories/prisma/mappers/footer.mapper";
import { getFooterAdminContent, getSocialLinksForAdmin } from "@/services/admin";

export default async function AdminFooterPage() {
  const [{ config, navigation, resources }, socialLinks] = await Promise.all([
    getFooterAdminContent(),
    getSocialLinksForAdmin(),
  ]);

  const resolvedConfig = config
    ? mapFooterConfigToAdminContent(config, navigation, resources)
    : siteFooterContent;

  const navigationLinks =
    navigation.length > 0 ? mapFooterAdminLinks(navigation) : [...siteFooterContent.navigation];
  const resourceLinks =
    resources.length > 0 ? mapFooterAdminLinks(resources) : [...siteFooterContent.resources];

  return (
    <FooterAdminView
      config={resolvedConfig}
      navigationLinks={navigationLinks}
      resourceLinks={resourceLinks}
      socialLinks={socialLinks.map((link) => ({
        platform: link.platform,
        label: link.label,
        href: link.href,
        visible: link.visible,
      }))}
    />
  );
}
