import { createServerClient } from '@/lib/supabase/server';
import BrandHubClientPage from './BrandHubClientPage';

export const revalidate = 0;

export default async function BrandHubPage() {
  const supabase = await createServerClient();

  // 1. Récupération de l'organisation par défaut
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'umoja-weavers')
    .single();

  const orgId = org?.id || '11111111-1111-1111-1111-111111111111';

  // 2. Récupération du snapshot de score de marque le plus récent
  const { data: scoreData } = await supabase
    .from('brand_scores')
    .select('score, delta, notes, recorded_at')
    .eq('org_id', orgId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  // Fallback si aucune donnée n'est trouvée (par exemple sur prod vide)
  const score = scoreData?.score ?? 85;
  const delta = scoreData?.delta ?? 0;
  const notes = scoreData?.notes ?? 'Résonance actuelle de votre communauté. Croissance régulière.';
  const recordedAt = scoreData?.recorded_at ?? null;

  return (
    <BrandHubClientPage
      score={score}
      delta={delta}
      notes={notes}
      recordedAt={recordedAt}
    />
  );
}
