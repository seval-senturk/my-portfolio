import type { NextAuthConfig } from "next-auth";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { canAccessAdminArea } from "@/lib/auth/permissions";
import { isUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/auth";

function resolveAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET environment variable is required in production.");
  }

  return "development-auth-secret-change-before-production";
}

export const authConfig = {
  secret: resolveAuthSecret(),
  trustHost: true,
  pages: {
    signIn: ADMIN_ROUTES.login,
    error: ADMIN_ROUTES.unauthorized,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = "role" in user ? user.role : undefined;

        token.sub = user.id;
        token.role = isUserRole(String(role)) ? role : "VIEWER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = isUserRole(String(token.role))
          ? (token.role as UserRole)
          : "VIEWER";
      }

      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isLoginPage = pathname === ADMIN_ROUTES.login;
      const isUnauthorizedPage = pathname === ADMIN_ROUTES.unauthorized;
      const isProtectedAdminRoute =
        pathname.startsWith("/admin") && !isLoginPage && !isUnauthorizedPage;

      if (!isProtectedAdminRoute) {
        return true;
      }

      if (!session?.user?.role) {
        return false;
      }

      return canAccessAdminArea(session.user.role);
    },
  },
} satisfies NextAuthConfig;
