# Observability

Production observability is **architecture-ready** but not fully wired to external vendors in v1.0.

## Current state

| Capability | Implementation |
|------------|----------------|
| Structured logging | `src/services/platform/logger.service.ts` (JSON in production) |
| Health checks | `GET /api/health` (public) · `GET /api/admin/health` (admin) |
| Error boundaries | `src/app/(site)/error.tsx`, `src/app/admin/error.tsx`, `global-error.tsx` |
| API error handler | `src/lib/platform/error-handler.ts` |
| Client error hook | `src/lib/observability/client.ts` → `reportClientError()` |

## Extension hooks

### Server — `observabilityHooks`

Location: `src/services/platform/logger.service.ts`

```typescript
export const observabilityHooks = {
  enabled: false,
  captureException(error, context?) { /* wire Sentry here */ },
  recordMetric(name, value, tags?) { /* wire OTel/Better Stack here */ },
};
```

Already called from:

- `logger.error()` when an `Error` instance is attached
- `handleApiError()` for all API route failures

### Client — `reportClientError()`

Location: `src/lib/observability/client.ts`

Used by React error boundaries. Replace implementation with `@sentry/nextjs` when ready.

## Recommended Sentry integration (future)

1. `npm install @sentry/nextjs`
2. Run Sentry wizard
3. Set `SENTRY_DSN` in Vercel
4. Update `observabilityHooks.captureException` to call `Sentry.captureException`
5. Update `reportClientError` similarly

## Log access today

- **Vercel:** Project → Logs (function + edge)
- **Neon:** Dashboard query insights
- **Resend:** Email delivery logs

## Metrics

No custom metrics dashboard yet. `recordMetric()` is a no-op placeholder for future OpenTelemetry or Better Stack integration.
