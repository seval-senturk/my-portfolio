"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/client";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/constants/routes";

interface SiteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SiteError({ error, reset }: SiteErrorProps) {
  useEffect(() => {
    reportClientError(error, { surface: "site" });
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <Heading as="h1">Something went wrong</Heading>
      <Text tone="muted" className="mx-auto mt-4 max-w-md">
        We could not load this page. Please try again or return to the homepage.
      </Text>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2 text-small font-medium hover:bg-muted"
        >
          Try again
        </button>
        <ButtonLink href={ROUTES.home} variant="primary" size="md">
          Go home
        </ButtonLink>
      </div>
    </Container>
  );
}
