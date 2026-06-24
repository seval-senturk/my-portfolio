import { auth } from "@/auth";
import { canAccessAdminArea } from "@/lib/auth/permissions";
import type { AuthUser } from "@/types/auth";

export async function getAuthSession() {
  return auth();
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();

  if (!session?.user?.email || !session.user.role) {
    return null;
  }

  return {
    id: session.user.id ?? "",
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };
}

export async function requireAuthenticatedUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdminUser(): Promise<AuthUser> {
  const user = await requireAuthenticatedUser();

  if (!canAccessAdminArea(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
