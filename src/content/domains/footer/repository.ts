import type { ContentQueryOptions } from "@/content/shared/types";
import type { SiteFooterContent } from "@/types/footer";

export interface FooterRepository {
  get(options?: ContentQueryOptions): Promise<SiteFooterContent>;
}
