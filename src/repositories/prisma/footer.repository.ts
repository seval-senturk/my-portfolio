import type { FooterRepository } from "@/content/domains/footer/repository";
import { siteFooterContent } from "@/data/site-footer.data";
import { prisma } from "@/lib/prisma";
import { mapFooterConfigToContent } from "@/repositories/prisma/mappers/footer.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasFooterConfigModel(): boolean {
  return (
    "footerConfig" in prisma &&
    typeof prisma.footerConfig?.findUnique === "function"
  );
}

export const prismaFooterRepository: FooterRepository = {
  async get(options) {
    if (!hasFooterConfigModel()) {
      return siteFooterContent;
    }

    const locale = resolveLocale(options);
    const config = await prisma.footerConfig.findUnique({ where: { locale } });

    if (!config) {
      return siteFooterContent;
    }

    return mapFooterConfigToContent(config);
  },
};
