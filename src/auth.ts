import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { authConfig } from "@/auth.config";
import { canAccessAdminArea } from "@/lib/auth/permissions";
import { isUserRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types/auth";

function isGoogleAuthEnabled(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValidPassword = await compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        if (!canAccessAdminArea(user.role)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...(isGoogleAuthEnabled()
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.trim().toLowerCase();

        if (!email) {
          return false;
        }

        const dbUser = await prisma.user.findUnique({ where: { email } });

        if (!dbUser || !canAccessAdminArea(dbUser.role)) {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        let role: UserRole | undefined =
          "role" in user && isUserRole(String(user.role)) ? user.role : undefined;

        if (!role && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.trim().toLowerCase() },
            select: { role: true },
          });
          role = dbUser?.role;
        }

        token.sub = user.id;
        token.role = isUserRole(String(role)) ? role : "VIEWER";
      }

      return token;
    },
  },
});

export function isGoogleOAuthConfigured(): boolean {
  return isGoogleAuthEnabled();
}
