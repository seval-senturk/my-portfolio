import { createHash, randomBytes } from "node:crypto";

import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createEmailProvider } from "@/services/email";
import { absoluteUrl } from "@/lib/url";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

const RESET_PREFIX = "password-reset:";
const TOKEN_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user?.passwordHash) {
    return;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: { identifier: `${RESET_PREFIX}${normalizedEmail}` },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: `${RESET_PREFIX}${normalizedEmail}`,
      token: tokenHash,
      expires,
    },
  });

  const resetUrl = absoluteUrl(
    `${ADMIN_ROUTES.resetPassword}?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`,
  );

  const emailProvider = createEmailProvider();
  await emailProvider.sendPasswordResetEmail(normalizedEmail, resetUrl);
}

export async function resetPasswordWithToken(
  email: string,
  token: string,
  newPassword: string,
): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const tokenHash = hashToken(token.trim());

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${RESET_PREFIX}${normalizedEmail}`,
      token: tokenHash,
      expires: { gt: new Date() },
    },
  });

  if (!record) {
    return false;
  }

  const passwordHash = await hash(newPassword, 12);

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { passwordHash },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: record.identifier,
        token: record.token,
      },
    },
  });

  return true;
}
