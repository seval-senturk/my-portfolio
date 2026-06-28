import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { SocialLinkInput } from "@/types/social";

export async function getSocialLinksForAdmin() {
  const settings = await prisma.siteSettings.findUnique({
    where: { locale: DEFAULT_LOCALE },
    select: {
      id: true,
      socialLinks: { orderBy: { sortOrder: "asc" } },
    },
  });

  return settings?.socialLinks ?? [];
}

export async function replaceSocialLinks(links: SocialLinkInput[]) {
  const settings = await prisma.siteSettings.findUnique({
    where: { locale: DEFAULT_LOCALE },
    select: { id: true },
  });

  if (!settings) {
    throw new Error("Site settings not found.");
  }

  await prisma.$transaction([
    prisma.socialLink.deleteMany({ where: { siteSettingsId: settings.id } }),
    prisma.socialLink.createMany({
      data: links.map((link, index) => ({
        siteSettingsId: settings.id,
        platform: link.platform,
        label: link.label,
        href: link.href,
        visible: link.visible,
        sortOrder: index,
      })),
    }),
  ]);
}
