import type { ContactRepository } from "@/content/domains/contact/repository";
import { prisma } from "@/lib/prisma";
import { mapContactToContent } from "@/repositories/prisma/mappers/contact.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

export const prismaContactRepository: ContactRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const [config, siteSettings] = await Promise.all([
      prisma.contactPageConfig.findUnique({ where: { locale } }),
      prisma.siteSettings.findUnique({
        where: { locale },
        include: {
          socialLinks: { orderBy: { sortOrder: "asc" } },
        },
      }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Contact page config", locale);
    }

    return mapContactToContent(config, siteSettings?.socialLinks ?? []);
  },
};
