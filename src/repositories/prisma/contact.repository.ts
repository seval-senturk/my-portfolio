import type { ContactRepository } from "@/content/domains/contact/repository";
import { contactContent } from "@/data/contact.data";
import { prisma } from "@/lib/prisma";
import { mapContactToContent } from "@/repositories/prisma/mappers/contact.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

function hasContactModels(): boolean {
  return (
    "contactPageConfig" in prisma &&
    typeof prisma.contactPageConfig?.findUnique === "function"
  );
}

export const prismaContactRepository: ContactRepository = {
  async get(options) {
    if (!hasContactModels()) {
      return contactContent;
    }

    try {
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
        return contactContent;
      }

      return mapContactToContent(config, siteSettings?.socialLinks ?? []);
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        return contactContent;
      }

      console.error("[contact.repository] Falling back to static contact content.", error);
      return contactContent;
    }
  },
};
