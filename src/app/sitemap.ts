import type { MetadataRoute } from "next";

import { buildDynamicSitemap } from "@/services/seo/seo-sitemap.service";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildDynamicSitemap();
}
