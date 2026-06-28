import type { MetadataRoute } from "next";

import { buildDynamicRobots } from "@/services/seo/seo-sitemap.service";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  return buildDynamicRobots();
}
