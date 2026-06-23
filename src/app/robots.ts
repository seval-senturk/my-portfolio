import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const disallowPaths = env.isProduction ? [] : ["/"];

  return {
    rules: {
      userAgent: "*",
      allow: env.isProduction ? "/" : undefined,
      disallow: disallowPaths,
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
