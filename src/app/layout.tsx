import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { SkipLink } from "@/components/shared/skip-link";
import { siteConfig } from "@/config/site.config";
import { rootMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/json-ld";
import { createPersonSchema, createWebSiteSchema } from "@/seo/structured-data";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const structuredData = [createPersonSchema(), createWebSiteSchema()] as const;

  return (
    <html lang={siteConfig.language} className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <SkipLink />
        <JsonLd data={structuredData} />
        {children}
      </body>
    </html>
  );
}
