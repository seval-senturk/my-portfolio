"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import {
  isValidEmail,
  validateEmail,
  validatePassword,
} from "@/lib/admin/validation";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

const REMEMBER_EMAIL_KEY = "admin-remember-email";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
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
      setError(
        isValidEmail(email)
          ? "Invalid email or password, or your account lacks admin access."
          : "We couldn't sign you in. Check your credentials and try again.",
      );
      return;
    }

    setSuccessMessage("Signed in successfully. Redirecting…");
    window.location.href = result.url ?? ADMIN_ROUTES.dashboard;
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-caption font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Portfolio CMS
        </p>
        <h1 className="mt-3 text-h2 font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <Text tone="muted" className="mt-2">
          Sign in to manage your portfolio content, projects, and site settings.
        </Text>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <Label htmlFor="admin-email" required>
            Email
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
            placeholder="you@example.com"
          />
          <FieldError id="admin-email-error" message={fieldErrors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="admin-password" required>
              Password
            </Label>
            <button
              type="button"
              className="text-caption text-accent hover:underline"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"} password
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
            placeholder="Enter your password"
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
            Remember me
          </label>
          <a
            href="mailto:hello@sevalsenturk.com?subject=Admin%20Password%20Reset"
            className="text-caption text-accent hover:underline"
          >
            Forgot password?
          </a>
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
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign in to Dashboard
        </Button>
      </form>
    </div>
  );
}
