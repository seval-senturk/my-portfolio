export type UserRole = "ADMIN" | "EDITOR" | "CONTRIBUTOR" | "VIEWER";

export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
}

export type AuthErrorCode = "unauthorized" | "forbidden" | "session_expired";

export interface AuthErrorContent {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}
