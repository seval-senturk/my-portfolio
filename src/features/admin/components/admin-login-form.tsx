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

function AdminLoginFormSkeleton({ enableGoogleAuth = false }: AdminLoginFormProps) {
  return (
    <div className="admin-login-form admin-login-form--skeleton" aria-hidden="true">
      <div className="admin-login-form__header">
        <div className="admin-login-form__skeleton admin-login-form__skeleton--title" />
        <div className="admin-login-form__skeleton admin-login-form__skeleton--subtitle" />
      </div>

      <div className="admin-login-form__fields">
        <div className="admin-login-form__skeleton admin-login-form__skeleton--label" />
        <div className="admin-login-form__skeleton admin-login-form__skeleton--input" />
        <div className="admin-login-form__skeleton admin-login-form__skeleton--label" />
        <div className="admin-login-form__skeleton admin-login-form__skeleton--input" />
      </div>

      <div className="admin-login-form__skeleton admin-login-form__skeleton--button" />

      {enableGoogleAuth ? (
        <>
          <div className="admin-login-form__divider" />
          <div className="admin-login-form__skeleton admin-login-form__skeleton--button" />
        </>
      ) : null}
    </div>
  );
}

export function AdminLoginForm({ enableGoogleAuth = false }: AdminLoginFormProps) {
  const [isReady, setIsReady] = useState(false);
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
    setIsReady(true);
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

  if (!isReady) {
    return <AdminLoginFormSkeleton enableGoogleAuth={enableGoogleAuth} />;
  }

  return (
    <div className="admin-login-form">
      <div className="admin-login-form__header">
        <h1 className="admin-login-form__title">{adminTr.login.welcome}</h1>
        <p className="admin-login-form__description">{adminTr.login.description}</p>
      </div>

      <form className="admin-login-form__fields" onSubmit={handleSubmit} noValidate>
        <div className="admin-login-form__field">
          <Label htmlFor="admin-email" required className="admin-login-form__label">
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
            className="admin-login-form__input"
            placeholder="ornek@email.com"
          />
          <FieldError id="admin-email-error" message={fieldErrors.email} />
        </div>

        <div className="admin-login-form__field">
          <div className="admin-login-form__password-row">
            <Label htmlFor="admin-password" required className="admin-login-form__label">
              {adminTr.login.password}
            </Label>
            <button
              type="button"
              className="admin-login-form__toggle-password"
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
            className="admin-login-form__input"
          />
          <FieldError id="admin-password-error" message={fieldErrors.password} />
        </div>

        <div className="admin-login-form__meta">
          <label className="admin-login-form__remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="admin-login-form__checkbox"
            />
            {adminTr.login.rememberMe}
          </label>
          <Link href={ADMIN_ROUTES.forgotPassword} className="admin-login-form__forgot">
            {adminTr.login.forgotPassword}
          </Link>
        </div>

        <FieldError id="admin-login-error" message={error} />

        {successMessage ? (
          <p className="admin-login-form__success" role="status">
            {successMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="admin-login-form__submit"
          isLoading={isLoading}
          disabled={isLoading || isGoogleLoading}
        >
          {adminTr.login.submit}
        </Button>
      </form>

      {enableGoogleAuth ? (
        <>
          <div className="admin-login-form__divider">
            <span>{adminTr.login.or}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="admin-login-form__google"
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
