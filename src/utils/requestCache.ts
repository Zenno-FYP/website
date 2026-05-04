/**
 * Auth-driven cache invalidation hook. The in-memory request cache was removed
 * because nothing used `cachedRequest`; callers still invoke this on login/logout
 * so a future cache layer can plug in without touching auth code.
 */
export function invalidateCacheOnAuthChange(): void {
  // Intentionally empty — reserved for future request deduplication.
}
