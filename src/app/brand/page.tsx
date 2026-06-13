import { getTranslations } from 'next-intl/server';
import { createServerClient } from '@/lib/supabase/server';
import BrandHubClientPage from './BrandHubClientPage';
import { withTimeout, QueryTimeoutError } from '@/lib/supabase/with-timeout';
import { unstable_cache } from 'next/cache';

export const revalidate = 60;

const QUERY_TIMEOUT_MS = 3000;

const loadBrandData = unstable_cache(
  async (): Promise<{ score: number; delta: number; notes: string | null; recorded_at: string } | null> => {
    try {
      const supabase = await createServerClient();

      const orgRes = await withTimeout(
        supabase.from('organizations').select('id').eq('slug', 'umoja-weavers').single(),
        QUERY_TIMEOUT_MS
      ).catch(() => null);
      const orgData = (orgRes as { data: unknown } | null)?.data as { id: string } | null;
      const orgId = orgData?.id || '11111111-1111-1111-1111-111111111111';

      const scoreRes = await withTimeout(
        supabase
          .from('brand_scores')
          .select('score, delta, notes, recorded_at')
          .eq('org_id', orgId)
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single(),
        QUERY_TIMEOUT_MS
      ).catch(() => null);
      return ((scoreRes as { data: unknown } | null)?.data as
        | { score: number; delta: number; notes: string | null; recorded_at: string }
        | null) || null;
    } catch (err: unknown) {
      console.error('[brand] cached fetch failed:', err);
      return null;
    }
  },
  ['brand-umoja-weavers-v1'],
  { revalidate: 60, tags: ['brand'] }
);

export default async function BrandHubPage() {
  let score = 85;
  let delta = 0;
  let recordedAt: string | null = null;
  let notes = '';

  try {
    const t = await getTranslations('hubs.brand');
    notes = t('impactLede');

    const data = await loadBrandData();
    if (data) {
      score = data.score;
      delta = data.delta;
      notes = data.notes || notes;
      recordedAt = data.recorded_at;
    }
  } catch (err: unknown) {
    console.error('[brand] fatal fallback:', err);
  }

  return <BrandHubClientPage score={score} delta={delta} notes={notes} recordedAt={recordedAt} />;
}
