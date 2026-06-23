import { env } from "@/lib/env";

export function absoluteUrl(pathname = ""): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPath === "/") {
    return env.siteUrl;
  }

  return `${env.siteUrl}${normalizedPath}`;
}
