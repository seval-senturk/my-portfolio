import { afterEach, describe, expect, it, vi } from "vitest";

import { isAuthSecretConfigured, resolveAuthSecret } from "@/lib/auth/resolve-auth-secret";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveAuthSecret", () => {
  it("returns configured secret when AUTH_SECRET is set", () => {
    vi.stubEnv("AUTH_SECRET", "test-secret-value");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveAuthSecret()).toBe("test-secret-value");
    expect(isAuthSecretConfigured()).toBe(true);
  });

  it("uses development fallback outside production runtime", () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveAuthSecret()).toContain("development-auth-secret");
  });

  it("throws in production runtime when AUTH_SECRET is missing", () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PHASE", "");
    expect(() => resolveAuthSecret()).toThrow(/AUTH_SECRET/);
  });
});
