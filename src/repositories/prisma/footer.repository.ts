import type { FooterRepository } from "@/content/domains/footer/repository";
import { siteFooterContent } from "@/data/site-footer.data";
import { prisma } from "@/lib/prisma";
import { mapFooterConfigToContent } from "@/repositories/prisma/mappers/footer.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasFooterModels(): boolean {
  return (
    "footerConfig" in prisma &&
    typeof prisma.footerConfig?.findUnique === "function" &&
    "footerNavLink" in prisma &&
    typeof prisma.footerNavLink?.findMany === "function"
  );
}

export const prismaFooterRepository: FooterRepository = {
  async get(options) {
    if (!hasFooterModels()) {
      return siteFooterContent;
    }

    const locale = resolveLocale(options);
    const [config, navigation, resources] = await Promise.all([
      prisma.footerConfig.findUnique({ where: { locale } }),
      prisma.footerNavLink.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.footerResourceLink.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    if (!config) {
      if (navigation.length === 0 && resources.length === 0) {
        return siteFooterContent;
      }

      return {
        ...siteFooterContent,
        navigation:
          navigation.length > 0
            ? navigation
                .filter((link) => link.visible)
                .map((link) => ({
                  id: link.id,
                  label: link.label,
                  href: link.href,
                  sortOrder: link.sortOrder,
                  visible: link.visible,
                }))
            : siteFooterContent.navigation,
        resources:
          resources.length > 0
            ? resources
                .filter((link) => link.visible)
                .map((link) => ({
                  id: link.id,
                  label: link.label,
                  href: link.href,
                  sortOrder: link.sortOrder,
                  visible: link.visible,
                }))
            : siteFooterContent.resources,
      };
    }

    const mapped = mapFooterConfigToContent(config, navigation, resources);

    return {
      ...mapped,
      navigation:
        mapped.navigation.length > 0 ? mapped.navigation : siteFooterContent.navigation,
      resources:
        mapped.resources.length > 0 ? mapped.resources : siteFooterContent.resources,
    };
  },
};
