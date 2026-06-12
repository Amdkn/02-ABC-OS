import { defineRouting } from 'next-intl/routing';

// A0 decision 2026-06-12: English first. French translation deferred.
// Add 'fr' to locales + add messages/fr.json when A0 commits to translating.
export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never',
});
