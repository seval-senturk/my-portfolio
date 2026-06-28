import type { ContentQueryOptions, FooterContent } from "@/content/shared/types";
import type { IdentifiedStatItem } from "@/types/stats";
import type { SiteSocialLink } from "@/types/social";

export interface SiteContent {
  footer: FooterContent;
  professionalHighlights: readonly IdentifiedStatItem[];
}

export interface SiteRepository {
  get(options?: ContentQueryOptions): Promise<SiteContent>;
  getFooter(options?: ContentQueryOptions): Promise<FooterContent>;
  getProfessionalHighlights(
    options?: ContentQueryOptions,
  ): Promise<readonly IdentifiedStatItem[]>;
  getSocialLinks(options?: ContentQueryOptions): Promise<readonly SiteSocialLink[]>;
}

export type { ContentQueryOptions };
