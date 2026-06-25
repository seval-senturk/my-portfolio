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
      <div className="space-y-4 text-center">
        <h1 className="text-h3 font-semibold">{adminTr.resetPassword.title}</h1>
        <p className="text-small text-success">{adminTr.resetPassword.success}</p>
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
        <h1 className="text-h3 font-semibold">{adminTr.resetPassword.title}</h1>
        <p className="mt-2 text-small text-muted-foreground">
          {adminTr.resetPassword.description}
        </p>
      </div>

      <form action={formAction} className="space-y-5" noValidate>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <div>
          <Label htmlFor="reset-password" required>
            {adminTr.resetPassword.password}
          </Label>
          <Input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="reset-confirm-password" required>
            {adminTr.resetPassword.confirmPassword}
          </Label>
          <Input
            id="reset-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-2"
          />
        </div>

        <FieldError id="reset-error" message={state?.error} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[var(--admin-brand,#7c3aed)] hover:bg-[var(--admin-brand-hover,#6d28d9)]"
          isLoading={isPending}
        >
          {adminTr.resetPassword.submit}
        </Button>
      </form>
    </div>
  );
}
