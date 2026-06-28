"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/client";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ButtonLink } from "@/components/ui/button-link";
import { ADMIN_ROUTES } from "@/config/admin-routes.config";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    reportClientError(error, { surface: "admin" });
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <Heading as="h1">Admin error</Heading>
      <Text tone="muted" className="mx-auto mt-4 max-w-md">
        Something went wrong in the admin panel. Your changes may not have been saved.
      </Text>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2 text-small font-medium hover:bg-muted"
        >
          Try again
        </button>
        <ButtonLink href={ADMIN_ROUTES.dashboard} variant="primary" size="md">
          Back to dashboard
        </ButtonLink>
      </div>
    </Container>
  );
}
