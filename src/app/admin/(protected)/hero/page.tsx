import Link from "next/link";

import { heroContent } from "@/data/hero.data";
import { mapHeroToAdminContent } from "@/repositories/prisma/mappers/hero.mapper";
import { HeroAdminView } from "@/features/admin/components/hero-admin-view";
import { getHeroAdminContent } from "@/services/admin/hero.admin.service";
import { getSocialLinksForAdmin } from "@/services/admin/social.admin.service";

export default async function AdminHeroPage() {
  const [{ hero, technologyCards, stats }, socialLinks] = await Promise.all([
    getHeroAdminContent(),
    getSocialLinksForAdmin(),
  ]);

  const content = hero
    ? mapHeroToAdminContent(hero, technologyCards, stats)
    : {
        ...heroContent,
        technologyCards: [...heroContent.technologyCards],
        stats: [...heroContent.stats],
      };

  return (
    <HeroAdminView
      initial={content}
      needsSetup={!hero}
      socialLinks={socialLinks.map((link) => ({
        platform: link.platform,
        label: link.label,
        href: link.href,
        visible: link.visible,
      }))}
    />
  );
}
