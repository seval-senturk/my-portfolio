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
      <div className="space-y-4 text-center">
        <h1 className="text-h3 font-semibold">{adminTr.forgotPassword.successTitle}</h1>
        <p className="text-small text-muted-foreground">
          {adminTr.forgotPassword.successDescription}
        </p>
        <Link
          href={ADMIN_ROUTES.login}
          className="inline-block text-small text-[var(--admin-brand,#7c3aed)] hover:underline"
        >
          {adminTr.forgotPassword.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-h3 font-semibold">{adminTr.forgotPassword.title}</h1>
        <p className="mt-2 text-small text-muted-foreground">
          {adminTr.forgotPassword.description}
        </p>
      </div>

      <form action={formAction} className="space-y-5" noValidate>
        <div>
          <Label htmlFor="forgot-email" required>
            {adminTr.forgotPassword.email}
          </Label>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2"
            placeholder="ornek@email.com"
          />
        </div>

        <FieldError id="forgot-error" message={state?.error} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[var(--admin-brand,#7c3aed)] hover:bg-[var(--admin-brand-hover,#6d28d9)]"
          isLoading={isPending}
        >
          {adminTr.forgotPassword.submit}
        </Button>

        <p className="text-center">
          <Link
            href={ADMIN_ROUTES.login}
            className="text-caption text-[var(--admin-brand,#7c3aed)] hover:underline"
          >
            {adminTr.forgotPassword.backToLogin}
          </Link>
        </p>
      </form>
    </div>
  );
}
