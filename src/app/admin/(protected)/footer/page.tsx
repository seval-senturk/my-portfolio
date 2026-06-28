import { siteFooterContent } from "@/data/site-footer.data";
import { FooterAdminView } from "@/features/admin/components/footer-admin-view";
import { getFooterConfig, getSocialLinksForAdmin } from "@/services/admin";
import { mapFooterConfigToContent } from "@/repositories/prisma/mappers/footer.mapper";

export default async function AdminFooterPage() {
  const [config, socialLinks] = await Promise.all([
    getFooterConfig(),
    getSocialLinksForAdmin(),
  ]);

  const resolvedConfig = config
    ? mapFooterConfigToContent(config)
    : siteFooterContent;

  return (
    <FooterAdminView
      config={resolvedConfig}
      socialLinks={socialLinks.map((link) => ({
        platform: link.platform,
        label: link.label,
        href: link.href,
        visible: link.visible,
      }))}
    />
  );
}
