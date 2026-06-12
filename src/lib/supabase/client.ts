import { createBrowserClient as createBrowser } from '@supabase/ssr';

export const createBrowserClient = () =>
  createBrowser(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'abc_os',
      },
    }
  );
