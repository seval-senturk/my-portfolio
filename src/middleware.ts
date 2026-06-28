import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { resolveAuthSecret } from "@/lib/auth/resolve-auth-secret";
import { canAccessAdminArea } from "@/lib/auth/permissions";
import { isUserRole } from "@/lib/auth/roles";
import { applySeoRedirect } from "@/lib/seo/redirect-middleware";

const PUBLIC_ADMIN_ROUTES = new Set<string>([
  ADMIN_ROUTES.login,
  ADMIN_ROUTES.unauthorized,
  ADMIN_ROUTES.forgotPassword,
  ADMIN_ROUTES.resetPassword,
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const redirectResponse = await applySeoRedirect(request);
    if (redirectResponse) {
      return redirectResponse;
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_ROUTES.has(pathname)) {
    const token = await getToken({ req: request, secret: resolveAuthSecret() });
    const roleValue = token?.role;
    const role = isUserRole(String(roleValue)) ? roleValue : undefined;

    if (!role || !canAccessAdminArea(role)) {
      const loginUrl = new URL(ADMIN_ROUTES.login, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
