import { unstable_cache } from 'next/cache';
import { withTimeout, QueryTimeoutError } from './with-timeout';

const QUERY_TIMEOUT_MS = 3000;
const CACHE_TTL_SECONDS = 60;

/**
 * Wrap a Supabase-fetching function with both:
 * - Next.js unstable_cache (60s window) to dedupe VPS hits across requests
 * - 3s wall-clock timeout to never block page render
 *
 * `keyParts` should include the org slug / tenant so multi-tenant caches
 * don't collide.
 */
export function cachedSupabaseQuery<T>(
  fn: () => Promise<T>,
  keyParts: string[]
): Promise<T> {
  const cached = unstable_cache(fn, keyParts, {
    revalidate: CACHE_TTL_SECONDS,
    tags: keyParts.map((k) => `supabase:${k}`),
  });

  return withTimeout(cached(), QUERY_TIMEOUT_MS).catch((err: unknown) => {
    if (err instanceof QueryTimeoutError) {
      // Cache miss + VPS is slow → caller falls back to mock
      throw err;
    }
    throw err;
  });
}
