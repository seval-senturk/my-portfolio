/**
 * Analytics integration hooks — register providers when enabling GA, GSC, Clarity, or Plausible.
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

export const analyticsHooks = {
  enabled: false,
  pageView(path: string) {
    void path;
  },
  track(event: AnalyticsEvent) {
    void event;
  },
};

export function trackPageView(path: string): void {
  if (!analyticsHooks.enabled) {
    return;
  }

  analyticsHooks.pageView(path);
}

export function trackEvent(name: string, properties?: AnalyticsEvent["properties"]): void {
  if (!analyticsHooks.enabled) {
    return;
  }

  analyticsHooks.track({ name, properties });
}

/** Env keys reserved for future activation (see docs/ENVIRONMENT.md) */
export const ANALYTICS_ENV_KEYS = [
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_CLARITY_PROJECT_ID",
  "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
] as const;
