/**
 * Client-side error reporting hook.
 * Wire to Sentry/Better Stack by replacing the implementation.
 */
export function reportClientError(
  error: Error,
  context?: Record<string, unknown>,
): void {
  console.error("[client-error]", error, context ?? {});
}
