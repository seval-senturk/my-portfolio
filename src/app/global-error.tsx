"use client";

import { useEffect } from "react";

import { reportClientError } from "@/lib/observability/client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, { surface: "global" });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-4 text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
