import type { SiteSettings } from "@prisma/client";

import type { SiteContent } from "@/content/domains/site/repository";
import { fromJson } from "@/repositories/prisma/mappers/json";
import type { IdentifiedStatItem } from "@/types/stats";

export function mapSiteToContent(settings: SiteSettings): SiteContent {
  return {
    footer: {
      tagline: settings.footerTagline,
      columns: {
        quickLinks: settings.footerQuickLinksLabel,
        connect: settings.footerConnectLabel,
      },
      copyrightSuffix: settings.footerCopyrightSuffix,
    },
    professionalHighlights: fromJson<readonly IdentifiedStatItem[]>(
      settings.professionalHighlights,
    ),
  };
}
