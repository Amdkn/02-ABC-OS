import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tour 4 perf (2026-06-14): opt into Next 15 staleTimes for static + dynamic
  // auto-invalidation, and tree-shake heavy barrel imports.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    optimizePackageImports: ['@material-symbols/font-400', '@supabase/supabase-js', '@supabase/ssr'],
  },
  // Material Symbols woff2 is large (~3MB full set). Preload only the
  // latin subset CSS and let the browser lazy-load the font.
  compress: true,
  poweredByHeader: false,
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);
