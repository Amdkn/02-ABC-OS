import { createServerClient as createServer } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createServerClient = async () => {
  const cookieStore = await cookies();

  return createServer(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'abc_os',
      },
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
            // Le setAll peut échouer s'il est appelé depuis un Server Component.
            // C'est géré par le middleware de rafraîchissement de session.
          }
        },
      },
    }
  );
};
