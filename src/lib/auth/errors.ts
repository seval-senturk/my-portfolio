import type { AuthErrorCode, AuthErrorContent } from "@/types/auth";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

export const AUTH_ERROR_CONTENT: Record<AuthErrorCode, AuthErrorContent> = {
  unauthorized: {
    title: "Sign in required",
    description:
      "You need to sign in with an authorized account to access the admin area.",
    actionLabel: "Go to login",
    actionHref: ADMIN_ROUTES.login,
  },
  forbidden: {
    title: "Access denied",
    description:
      "Your account does not have permission to access this admin resource.",
    actionLabel: "Back to dashboard",
    actionHref: ADMIN_ROUTES.dashboard,
  },
  session_expired: {
    title: "Session expired",
    description: "Your session has ended. Please sign in again to continue.",
    actionLabel: "Sign in again",
    actionHref: ADMIN_ROUTES.login,
  },
};

export function getAuthErrorContent(code: AuthErrorCode): AuthErrorContent {
  return AUTH_ERROR_CONTENT[code];
}
