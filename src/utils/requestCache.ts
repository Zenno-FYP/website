/**
 * Simple in-memory cache for async requests to prevent duplicate calls
 * Useful for preventing multiple concurrent requests for the same data
 */

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Executes an async function with caching to prevent duplicate requests
 * 
 * @param key - Cache key (unique identifier for the request)
 * @param fn - Async function to execute
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns Promise that resolves to the function result
 * 
 * Example:
 * ```tsx
 * const data = await cachedRequest(
 *   `user-${userId}`,
 *   () => userService.getProfile(),
 *   10 * 60 * 1000 // 10 minutes
 * );
 * ```
 */
export function cachedRequest<T>(
  key: string,
  fn: () => Promise<T>,
  ttl = DEFAULT_TTL
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached promise if still valid
  if (cached && now - cached.timestamp < ttl) {
    return cached.promise;
  }

  // Execute function and cache the promise
  const promise = fn();
  cache.set(key, { promise, timestamp: now });

  return promise;
}

/**
 * Invalidates a specific cache entry
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Clears all cached requests
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Invalidates cache when user changes (logout, login, etc)
 */
export function invalidateCacheOnAuthChange(): void {
  // Clear caches that depend on user context
  const keysToInvalidate = Array.from(cache.keys()).filter(
    (key) =>
      key.startsWith('user-') ||
      key.startsWith('api-') ||
      key.includes('dashboard')
  );

  keysToInvalidate.forEach((key) => invalidateCache(key));
}
