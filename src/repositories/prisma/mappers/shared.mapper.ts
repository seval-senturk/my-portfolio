import type { SeoMetadata } from "@prisma/client";

import type { EmploymentDate } from "@/types/experience";
import type { MediaProvider, SeoFields } from "@/content/shared/types";

export function mapEmploymentDate(
  month: number | null | undefined,
  year: number | null | undefined,
): EmploymentDate | undefined {
  if (month == null || year == null) {
    return undefined;
  }

  return { month, year };
}

export function mapSeoFields(seo: SeoMetadata | null): SeoFields {
  if (!seo) {
    return {};
  }

  return {
    metaTitle: seo.metaTitle ?? undefined,
    metaDescription: seo.metaDescription ?? undefined,
    canonicalUrl: seo.canonicalUrl ?? undefined,
    keywords: seo.keywords,
    ogImage: seo.ogImageUrl
      ? {
          id: `${seo.entityType}-${seo.entityId}-og`,
          url: seo.ogImageUrl,
          alt: seo.ogImageAlt ?? undefined,
          provider: (seo.ogImageProvider?.toLowerCase() ??
            "external") as MediaProvider,
          publicId: seo.ogImagePublicId ?? undefined,
        }
      : undefined,
  };
}
