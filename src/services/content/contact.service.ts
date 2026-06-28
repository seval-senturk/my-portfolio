import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContactRepository } from "@/content/domains/contact/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaContactRepository } from "@/repositories/prisma/contact.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ContactContent } from "@/types/contact";

export class ContactContentService {
  constructor(
    private readonly repository: ContactRepository = prismaContactRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ContactContent> {
    const locale = resolveLocale(options);
    return cacheContent("contact", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const contactContentServiceLayer = new ContactContentService();
