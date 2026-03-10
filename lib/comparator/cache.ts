/**
 * In-memory TTL cache with single-flight (request coalescing).
 *
 * - Prevents thundering herd: if N concurrent requests arrive for the same
 *   key while a fetch is in flight, all N wait for the single in-flight
 *   promise rather than spawning N provider calls.
 * - In a multi-process / serverless environment consider upgrading to Redis
 *   (set REDIS_URL in .env and swap this module).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

type InFlight<T> = Promise<T>;

// Global singletons so they survive hot-reload in dev (Next.js edge caveat)
const store = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, InFlight<unknown>>();
// Extended stale store: keeps the last successful value for 24 h so we can
// return it when a fresh fetch fails (stale-while-error pattern).
const staleStore = new Map<string, CacheEntry<unknown>>();

/**
 * Get a value from the cache.
 * Returns undefined if missing or expired.
 */
export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

/**
 * Store a value in the cache with a TTL in seconds.
 */
export function cacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1_000 });
}

/**
 * Delete a cache entry.
 */
export function cacheDel(key: string): void {
  store.delete(key);
  inFlight.delete(key);
}

/**
 * Single-flight wrapper.
 *
 * If a fetch for `key` is already in flight, returns the same promise.
 * Otherwise calls `fetcher()`, caches the result with `ttlSeconds`, and
 * resolves all waiters.
 *
 * On error the in-flight entry is cleared so the next caller retries.
 */
export async function cacheFetch<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  // Cache hit
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return cached;

  // Already in flight
  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>;
  }

  // Start new fetch
  const promise = fetcher()
    .then((value) => {
      cacheSet(key, value, ttlSeconds);
      // Also keep a 24-h stale copy so we can fall back on API errors
      staleStore.set(key, { value, expiresAt: Date.now() + 86_400_000 });
      inFlight.delete(key);
      return value;
    })
    .catch((err: unknown) => {
      inFlight.delete(key);
      // Return last-known-good value instead of propagating the error
      const stale = staleStore.get(key) as CacheEntry<T> | undefined;
      if (stale) {
        console.warn(`[cache] stale-while-error for key="${key}":`, err);
        // Re-add to fresh cache for 60 s so we retry rather than hammering
        store.set(key, { value: stale.value, expiresAt: Date.now() + 60_000 });
        return stale.value;
      }
      throw err;
    });

  inFlight.set(key, promise as InFlight<unknown>);
  return promise;
}

/**
 * Purge all expired entries (call periodically to avoid unbounded growth).
 */
export function cachePurgeExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) store.delete(key);
  }
}

/** Cache stats for /health endpoint */
export function cacheStats() {
  return { size: store.size, inFlight: inFlight.size };
}
