"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { resetPasswordAction } from "@/features/admin/actions/auth.actions";
import { adminTr } from "@/features/admin/i18n/tr";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminResetPasswordFormProps {
  email: string;
  token: string;
}

export function AdminResetPasswordForm({ email, token }: AdminResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await resetPasswordAction(formData);
      if (!result.success) {
        return { error: result.error };
      }
      return { success: true };
    },
    null,
  );

  if (state?.success) {
    return (
      <div className="admin-login-form">
        <div className="admin-login-form__header">
          <h1 className="admin-login-form__title">{adminTr.resetPassword.title}</h1>
          <p className="admin-login-form__success">{adminTr.resetPassword.success}</p>
        </div>
        <Link href={ADMIN_ROUTES.login} className="admin-link text-center text-small">
          {adminTr.forgotPassword.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-login-form">
      <div className="admin-login-form__header">
        <h1 className="admin-login-form__title">{adminTr.resetPassword.title}</h1>
        <p className="admin-login-form__description">{adminTr.resetPassword.description}</p>
      </div>

      <form action={formAction} className="admin-login-form__fields" noValidate>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <div className="admin-login-form__field">
          <Label htmlFor="reset-password" required className="admin-login-form__label">
            {adminTr.resetPassword.password}
          </Label>
          <Input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="admin-login-form__input"
          />
        </div>

        <div className="admin-login-form__field">
          <Label htmlFor="reset-confirm-password" required className="admin-login-form__label">
            {adminTr.resetPassword.confirmPassword}
          </Label>
          <Input
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="admin-login-form__input"
          />
        </div>

        <FieldError id="reset-error" message={state?.error} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="admin-login-form__submit"
          isLoading={isPending}
        >
          {adminTr.resetPassword.submit}
        </Button>
      </form>
    </div>
  );
}
