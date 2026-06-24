"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: ADMIN_ROUTES.dashboard,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password, or your account lacks admin access.");
      return;
    }

    window.location.href = result.url ?? ADMIN_ROUTES.dashboard;
  }

  return (
    <Card>
      <Card.Content>
        <Heading as="h1" variant="h3">
          Admin Sign In
        </Heading>
        <Text tone="muted" className="mt-2">
          Sign in with your authorized admin credentials.
        </Text>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="admin-email" required>
              Email
            </Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="admin-password" required>
              Password
            </Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2"
            />
          </div>

          <FieldError id="admin-login-error" message={error} />

          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}
