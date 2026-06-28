import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { SkipLink } from "@/components/shared/skip-link";
import { GlobalStructuredData } from "@/components/seo/global-structured-data";
import { siteConfig } from "@/config/site.config";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";
import { siteFonts } from "@/styles/fonts";

import "./globals.css";

function withSiteVerification(metadata: Metadata): Metadata {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  if (!googleVerification && !bingVerification) {
    return metadata;
  }

  return {
    ...metadata,
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
    },
  };
}

export async function generateMetadata() {
  return withSiteVerification(await buildPageMetadata(SEO_PAGE_KEYS.HOME));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.language}
      className={`${siteFonts.className} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <SkipLink />
        <Suspense fallback={null}>
          <GlobalStructuredData />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
