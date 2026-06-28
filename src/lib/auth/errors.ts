import type { AuthErrorCode, AuthErrorContent } from "@/types/auth";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

export const AUTH_ERROR_CONTENT: Record<AuthErrorCode, AuthErrorContent> = {
  unauthorized: {
    title: "Giriş gerekli",
    description:
      "Admin alanına erişmek için yetkili bir hesapla giriş yapmanız gerekir.",
    actionLabel: "Giriş sayfasına git",
    actionHref: ADMIN_ROUTES.login,
  },
  forbidden: {
    title: "Erişim reddedildi",
    description:
      "Hesabınızın bu admin kaynağına erişim izni yok.",
    actionLabel: "Kontrol paneline dön",
    actionHref: ADMIN_ROUTES.dashboard,
  },
  session_expired: {
    title: "Oturum süresi doldu",
    description: "Oturumunuz sona erdi. Devam etmek için tekrar giriş yapın.",
    actionLabel: "Tekrar giriş yap",
    actionHref: ADMIN_ROUTES.login,
  },
};

export function getAuthErrorContent(code: AuthErrorCode): AuthErrorContent {
  return AUTH_ERROR_CONTENT[code];
}
