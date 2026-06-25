import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { SkipLink } from "@/components/shared/skip-link";
import { siteConfig } from "@/config/site.config";
import { JsonLd } from "@/seo/json-ld";
import { buildGlobalStructuredData } from "@/services/seo/seo-structured-data.service";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata() {
  return buildPageMetadata(SEO_PAGE_KEYS.HOME);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const structuredData = await buildGlobalStructuredData();

  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <SkipLink />
        <JsonLd data={structuredData} />
        {children}
      </body>
    </html>
  );
}
