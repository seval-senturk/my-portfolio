import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATUS_MAP: Record<string, number> = {
  PERMANENT_301: 301,
  TEMPORARY_302: 302,
  TEMPORARY_307: 307,
  PERMANENT_308: 308,
};

type RedirectMap = Record<string, { toPath: string; statusCode: string }>;

let cachedRedirects: { map: RedirectMap; expiresAt: number } | null = null;

async function fetchRedirectMap(origin: string): Promise<RedirectMap> {
  if (cachedRedirects && Date.now() < cachedRedirects.expiresAt) {
    return cachedRedirects.map;
  }

  const response = await fetch(`${origin}/api/seo/redirect-map`, {
    headers: { "x-seo-redirect-fetch": "1" },
  });

  if (!response.ok) {
    return {};
  }

  const map = (await response.json()) as RedirectMap;
  cachedRedirects = { map, expiresAt: Date.now() + 60_000 };
  return map;
}

export async function applySeoRedirect(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  try {
    const map = await fetchRedirectMap(request.nextUrl.origin);
    const hit = map[pathname];
    if (!hit) {
      return null;
    }

    const destination = hit.toPath.startsWith("http")
      ? hit.toPath
      : new URL(hit.toPath, request.url).toString();

    return NextResponse.redirect(destination, STATUS_MAP[hit.statusCode] ?? 301);
  } catch {
    return null;
  }
}

export function invalidateRedirectCache(): void {
  cachedRedirects = null;
}
