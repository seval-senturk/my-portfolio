"use client";

import Link from "next/link";
import { useActionState } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { requestPasswordResetAction } from "@/features/admin/actions/auth.actions";
import { adminTr } from "@/features/admin/i18n/tr";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await requestPasswordResetAction(formData);
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
          <h1 className="admin-login-form__title">{adminTr.forgotPassword.successTitle}</h1>
          <p className="admin-login-form__description">
            {adminTr.forgotPassword.successDescription}
          </p>
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
        <h1 className="admin-login-form__title">{adminTr.forgotPassword.title}</h1>
        <p className="admin-login-form__description">{adminTr.forgotPassword.description}</p>
      </div>

      <form action={formAction} className="admin-login-form__fields" noValidate>
        <div className="admin-login-form__field">
          <Label htmlFor="forgot-email" required className="admin-login-form__label">
            {adminTr.forgotPassword.email}
          </Label>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            className="admin-login-form__input"
            placeholder="ornek@email.com"
          />
        </div>

        <FieldError id="forgot-error" message={state?.error} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="admin-login-form__submit"
          isLoading={isPending}
        >
          {adminTr.forgotPassword.submit}
        </Button>

        <p className="text-center">
          <Link href={ADMIN_ROUTES.login} className="admin-link text-caption">
            {adminTr.forgotPassword.backToLogin}
          </Link>
        </p>
      </form>
    </div>
  );
}
