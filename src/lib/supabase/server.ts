import { createServerClient as createServer } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type SupabaseServerClient = ReturnType<typeof createServer>;

/**
 * Returns true if at least one Supabase auth cookie is present in the request.
 * When false, the caller is anonymous and we can skip the cookie store entirely,
 * which makes the route eligible for ISR/SSG caching.
 */
async function hasAuthCookie(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    return all.some((c) => c.name.startsWith('sb-') && c.value && c.value.length > 0);
  } catch {
    return false;
  }
}

/**
 * Anon server client — no cookies read, no RSC opt-out.
 * Safe to use inside RSC pages that will be ISR-cached.
 */
function createAnonClient(): SupabaseServerClient {
  return createServer(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'abc_os' },
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op in anon mode
        },
      },
    }
  );
}

/**
 * Authenticated server client — reads/writes session cookies.
 * Only used when an auth cookie is detected. Makes the route dynamic.
 */
async function createAuthedClient(): Promise<SupabaseServerClient> {
  const cookieStore = await cookies();
  return createServer(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: 'abc_os' },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll can fail when called from a Server Component.
            // Session refresh is handled by middleware.
          }
        },
      },
    }
  );
}

/**
 * Default server client factory — auto-detects auth presence.
 * - If auth cookie exists → authed client (dynamic, per-user)
 * - If no auth cookie → anon client (eligible for ISR/SSG)
 */
export const createServerClient = async (): Promise<SupabaseServerClient> => {
  if (await hasAuthCookie()) {
    return createAuthedClient();
  }
  return createAnonClient();
};
