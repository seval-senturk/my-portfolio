import type { MetadataRoute } from "next";

import { buildDynamicSitemap } from "@/services/seo/seo-sitemap.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildDynamicSitemap();
}
