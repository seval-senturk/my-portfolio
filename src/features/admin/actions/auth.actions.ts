"use server";

import { adminError, adminSuccess } from "@/lib/admin/action-result";
import { getString, validateEmail, validatePassword } from "@/lib/admin/validation";
import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/services/admin/password-reset.service";

export async function requestPasswordResetAction(formData: FormData) {
  const email = getString(formData, "email");
  const emailError = validateEmail(email);

  if (emailError) {
    return adminError(emailError);
  }

  try {
    await requestPasswordReset(email);
  } catch {
    // Avoid leaking whether the account exists.
  }

  return adminSuccess("reset-email-sent");
}

export async function resetPasswordAction(formData: FormData) {
  const email = getString(formData, "email");
  const token = getString(formData, "token");
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) {
    return adminError(emailError);
  }

  if (passwordError) {
    return adminError(passwordError);
  }

  if (password !== confirmPassword) {
    return adminError("Passwords do not match.");
  }

  if (!token) {
    return adminError("Invalid or expired reset link.");
  }

  const success = await resetPasswordWithToken(email, token, password);

  if (!success) {
    return adminError("Invalid or expired reset link.");
  }

  return adminSuccess("password-updated");
}
