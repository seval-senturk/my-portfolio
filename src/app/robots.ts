import type { MetadataRoute } from "next";

import { buildDynamicRobots } from "@/services/seo/seo-sitemap.service";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return buildDynamicRobots();
}
