"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import {
  validateEmail,
  validatePassword,
} from "@/lib/admin/validation";
import { adminTr } from "@/features/admin/i18n/tr";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const REMEMBER_EMAIL_KEY = "admin-remember-email";

interface AdminLoginFormProps {
  enableGoogleAuth?: boolean;
}

export function AdminLoginForm({ enableGoogleAuth = false }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  useEffect(() => {
    const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSuccessMessage(undefined);

    const nextFieldErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) nextFieldErrors.email = emailError;
    if (passwordError) nextFieldErrors.password = passwordError;

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    if (rememberMe) {
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
    } else {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl: ADMIN_ROUTES.dashboard,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError(adminTr.login.invalidCredentials);
      return;
    }

    setSuccessMessage(adminTr.login.success);
    window.location.href = result.url ?? ADMIN_ROUTES.dashboard;
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError(undefined);
    await signIn("google", { callbackUrl: ADMIN_ROUTES.dashboard });
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="text-h3 font-semibold tracking-tight">{adminTr.login.welcome}</h1>
        <p className="mt-2 text-small text-muted-foreground">
          {adminTr.login.description}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <Label htmlFor="admin-email" required>
            {adminTr.login.email}
          </Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            hasError={Boolean(fieldErrors.email)}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2"
            placeholder="ornek@email.com"
          />
          <FieldError id="admin-email-error" message={fieldErrors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="admin-password" required>
              {adminTr.login.password}
            </Label>
            <button
              type="button"
              className="text-caption text-[var(--admin-brand,#7c3aed)] hover:underline"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? adminTr.login.hidePassword : adminTr.login.showPassword}
            </button>
          </div>
          <Input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            hasError={Boolean(fieldErrors.password)}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2"
          />
          <FieldError id="admin-password-error" message={fieldErrors.password} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 text-small text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="rounded border-border"
            />
            {adminTr.login.rememberMe}
          </label>
          <Link
            href={ADMIN_ROUTES.forgotPassword}
            className="text-caption text-[var(--admin-brand,#7c3aed)] hover:underline"
          >
            {adminTr.login.forgotPassword}
          </Link>
        </div>

        <FieldError id="admin-login-error" message={error} />

        {successMessage ? (
          <p className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-small text-success">
            {successMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[var(--admin-brand,#7c3aed)] text-white hover:bg-[var(--admin-brand-hover,#6d28d9)]"
          isLoading={isLoading}
          disabled={isLoading || isGoogleLoading}
        >
          {adminTr.login.submit}
        </Button>
      </form>

      {enableGoogleAuth ? (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-caption text-muted-foreground">veya</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            isLoading={isGoogleLoading}
            disabled={isLoading || isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            {adminTr.login.google}
          </Button>
        </>
      ) : null}
    </div>
  );
}
