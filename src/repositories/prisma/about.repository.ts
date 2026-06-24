import type { AboutRepository } from "@/content/domains/about/repository";
import { prisma } from "@/lib/prisma";
import { mapAboutToContent } from "@/repositories/prisma/mappers/about.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import {
  resolveLocale,
  toPrismaContentStatus,
} from "@/repositories/shared/locale";

export const prismaAboutRepository: AboutRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const about = await prisma.about.findFirst({
      where: {
        locale,
        status: toPrismaContentStatus(options?.status),
      },
    });

    if (!about) {
      throw new ContentNotFoundError("About", locale);
    }

    return mapAboutToContent(about);
  },
};
