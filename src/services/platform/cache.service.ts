export interface CacheSetOptions {
  ttlMs?: number;
}

export interface CacheProvider {
  readonly name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

interface MemoryEntry {
  value: unknown;
  expiresAt: number | null;
}

export class MemoryCacheProvider implements CacheProvider {
  readonly name = "memory";
  private store = new Map<string, MemoryEntry>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    const expiresAt = options?.ttlMs ? Date.now() + options.ttlMs : null;
    this.store.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

const memoryProvider = new MemoryCacheProvider();

/** Future: Redis, Edge Cache providers register here */
const providers: Record<string, CacheProvider> = {
  memory: memoryProvider,
};

let activeProvider: CacheProvider = memoryProvider;

export function getCacheProvider(): CacheProvider {
  return activeProvider;
}

export function setCacheProvider(name: keyof typeof providers): void {
  activeProvider = providers[name] ?? memoryProvider;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  return getCacheProvider().get<T>(key);
}

export async function cacheSet<T>(key: string, value: T, ttlMs?: number): Promise<void> {
  await getCacheProvider().set(key, value, { ttlMs });
}

export async function cacheDelete(key: string): Promise<void> {
  await getCacheProvider().delete(key);
}

export async function cacheGetOrSet<T>(
  key: string,
  factory: () => Promise<T>,
  ttlMs = 60_000,
): Promise<T> {
  const cached = await cacheGet<T>(key);

  if (cached !== null) {
    return cached;
  }

  const value = await factory();
  await cacheSet(key, value, ttlMs);
  return value;
}
