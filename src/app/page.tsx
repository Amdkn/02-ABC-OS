import { createServerClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import DashboardClientPage from './DashboardClientPage';
import { AppData } from '@/types';
import { INITIAL_DATA } from '@/data/mockData';
import { withTimeout, QueryTimeoutError } from '@/lib/supabase/with-timeout';
import { unstable_cache } from 'next/cache';

export const revalidate = 60;

interface HubPulsePayload {
  threads?: number;
  events?: number;
  inProgress?: number;
  completed?: number;
  score?: number;
  delta?: number;
  [key: string]: unknown;
}

interface DBMember {
  id: string;
  name: string;
  initials?: string | null;
  tint?: string | null;
  org_id: string;
}

interface DBPulseItem {
  hub: string;
  payload: HubPulsePayload;
}

interface DBActionItem {
  id: string;
  hub: 'community' | 'learn' | 'build' | 'brand';
  title: string;
  description?: string | null;
  due_at?: string | null;
  urgent: boolean;
}

interface DBSpotlightProject {
  id: string;
  name: string;
  tag?: string | null;
  description?: string | null;
  place?: string | null;
  ms: number;
  ms_total: number;
  pct: number;
  team?: { name: string; tint: string }[] | null;
}

interface DBFeedItem {
  id: string;
  who: string;
  av?: { initials?: string | null; tint?: string | null } | null;
  hub: 'community' | 'learn' | 'build' | 'brand';
  what: string;
  detail?: string | null;
  created_at: string;
  place?: string | null;
}

const QUERY_TIMEOUT_MS = 3000;

function formatWhen(dateStr: string, t: (key: string) => string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} ${t('min')}`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${t('h')}`;
  }
  return t('yesterday');
}

function formatDue(dateStr: string, t: (key: string) => string): string {
  const diffMs = new Date(dateStr).getTime() - Date.now();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 0) return t('overdue');
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} ${t('min')}`;
  }
  if (diffHours < 24) {
    return t('tomorrow');
  }
  return `${Math.floor(diffHours / 24)} ${t('days')}`;
}

/**
 * Fallback payload: used when Supabase is slow/down. Renders deterministic mock.
 * Replaces hardcoded FR date strings in INITIAL_DATA with locale-aware
 * `t('time.*')` values so EN/FR render correctly.
 */
function buildFallbackData(t: (key: string) => string): AppData {
  // Fixed offsets from "now" for deterministic fallback (in milliseconds).
  const now = Date.now();
  const min12 = new Date(now - 12 * 60 * 1000).toISOString();
  const h2 = new Date(now - 2 * 60 * 60 * 1000).toISOString();
  const h4 = new Date(now - 4 * 60 * 60 * 1000).toISOString();
  const h26 = new Date(now - 26 * 60 * 60 * 1000).toISOString();
  const tomorrow = new Date(now + 24 * 60 * 60 * 1000).toISOString();

  return {
    ...INITIAL_DATA,
    actions: INITIAL_DATA.actions.map((a, idx) => {
      // Mirror the action ordering in mockData.ts:
      // 0=build urgent (tomorrow), 1=learn (12 min), 2=community (null), 3=brand (null)
      let due: string | null = a.due;
      if (idx === 0) due = formatDue(tomorrow, t);
      else if (idx === 1) due = formatWhen(min12, t);
      else if (a.due !== null) due = formatDue(a.due, t);
      return { ...a, due };
    }),
    feed: INITIAL_DATA.feed.map((f, idx) => {
      // Mirror the feed ordering in mockData.ts:
      // 0=community (2h), 1=learn (4h), 2=build (yesterday), 3=brand (yesterday)
      let when: string = f.when;
      if (idx === 0) when = formatWhen(h2, t);
      else if (idx === 1) when = formatWhen(h4, t);
      else if (idx === 2 || idx === 3) when = formatWhen(h26, t);
      return { ...f, when };
    }),
  };
}

interface RawDashboardData {
  members: DBMember[];
  pulse: DBPulseItem[];
  actions: DBActionItem[];
  spotlight: DBSpotlightProject[];
  feed: DBFeedItem[];
  coopName: string;
  coopPlace: string;
}

/**
 * Fetches the entire dashboard dataset in one cached call.
 * unstable_cache dedupes across requests inside a 60s window.
 * Each underlying query has its own 3s wall-clock timeout.
 */
const loadDashboardData = unstable_cache(
  async (): Promise<RawDashboardData | null> => {
    try {
      const supabase = await createServerClient();

      const orgRes = await withTimeout(
        supabase.from('organizations').select('id, name, place').eq('slug', 'umoja-weavers').single(),
        QUERY_TIMEOUT_MS
      ).catch(() => null);
      const org = (orgRes as { data: { id: string; name: string; place: string } | null } | null)?.data || null;
      const orgId = org?.id || '11111111-1111-1111-1111-111111111111';
      const coopName = org?.name || 'Umoja Weavers';
      const coopPlace = org?.place || 'Nairobi, Kenya';

      const safeQuery = <T,>(p: PromiseLike<T>): Promise<T> =>
        withTimeout(p, QUERY_TIMEOUT_MS).catch((err: unknown) => {
          if (!(err instanceof QueryTimeoutError)) {
            console.warn('[dashboard] query failed:', err);
          }
          return null as T;
        });

      const [dbMembers, dbPulse, dbActions, dbSpotlight, dbFeed] = await Promise.all([
        safeQuery(supabase.from('members').select('*').eq('org_id', orgId)),
        safeQuery(supabase.from('hub_pulse').select('hub, payload').eq('org_id', orgId)),
        safeQuery(supabase.from('action_items').select('*').eq('org_id', orgId).order('due_at', { ascending: true })),
        safeQuery(supabase.from('spotlight_projects').select('*').eq('org_id', orgId)),
        safeQuery(supabase.from('feed_items').select('*').eq('org_id', orgId).order('created_at', { ascending: false })),
      ]);

      if (!dbMembers && !dbPulse && !dbActions && !dbSpotlight && !dbFeed) {
        return null;
      }

      return {
        members: ((dbMembers as { data: unknown } | null)?.data as DBMember[] | null) || [],
        pulse: ((dbPulse as { data: unknown } | null)?.data as DBPulseItem[] | null) || [],
        actions: ((dbActions as { data: unknown } | null)?.data as DBActionItem[] | null) || [],
        spotlight: ((dbSpotlight as { data: unknown } | null)?.data as DBSpotlightProject[] | null) || [],
        feed: ((dbFeed as { data: unknown } | null)?.data as DBFeedItem[] | null) || [],
        coopName,
        coopPlace,
      };
    } catch (err: unknown) {
      console.error('[dashboard] cached fetch failed:', err);
      return null;
    }
  },
  ['dashboard-umoja-weavers-v1'],
  { revalidate: 60, tags: ['dashboard'] }
);

export default async function DashboardPage() {
  let initialData: AppData;

  try {
    const t = await getTranslations('time');
    const tFallback = await getTranslations('dashboard');

    const raw = await loadDashboardData();

    if (!raw) {
      initialData = buildFallbackData(t);
    } else {
      const castedMembers = raw.members as DBMember[];
      const defaultMember = castedMembers.find((m) => m.name.includes('Amara')) || castedMembers[0] || {
        name: tFallback('fallbackMemberName'),
        initials: 'AO',
        tint: 'linear-gradient(150deg,#FFC72C,#E57373)',
      };

      const member = {
        name: defaultMember.name.split(' ')[0],
        full: defaultMember.name,
        initials: defaultMember.initials || 'AO',
        tint: defaultMember.tint || 'linear-gradient(150deg,#FFC72C,#E57373)',
      };

      const pulsesMap: Record<string, HubPulsePayload> = {};
      raw.pulse.forEach((p) => {
        pulsesMap[p.hub] = p.payload;
      });

      const castedSpotlight = raw.spotlight as DBSpotlightProject[];
      const spotlightProject = castedSpotlight.find((p) => p.name === 'Solaris Agri-Coop') || castedSpotlight[0];
      const umojaProject = castedSpotlight.find((p) => p.name === 'Umoja Weavers') || castedSpotlight[1];

      const pulse = {
        community: {
          count: `${pulsesMap.community?.threads || 4} discussions`,
          meta: `${pulsesMap.community?.events || 2} events upcoming · #Legal #Startup active`,
        },
        learn: {
          course: 'Architect Principles',
          pct: 60,
          meta: `${pulsesMap.learn?.inProgress || 3} in progress · ${pulsesMap.learn?.completed || 2} completed`,
        },
        build: {
          project: spotlightProject?.name || 'Solaris Agri-Coop',
          ms: spotlightProject?.ms || 3,
          msTotal: spotlightProject?.ms_total || 5,
          meta: 'Next: Solar irrigation',
          team: Array.isArray(spotlightProject?.team)
            ? spotlightProject.team.map((tt) => [tt.name, tt.tint] as [string, string])
            : [],
        },
        brand: {
          score: pulsesMap.brand?.score || 85,
          delta: pulsesMap.brand?.delta || 4,
        },
      };

      const actions = raw.actions.map((item) => {
        // Map hub → i18n kind for the action template. The raw DB doesn't carry
        // a `kind` discriminator, so we infer it from the hub (build→complete_milestone,
        // learn→complete_module, community→reply_discussion, brand→strengthen_brand).
        const hubToKind: Record<string, 'complete_milestone' | 'complete_module' | 'reply_discussion' | 'strengthen_brand'> = {
          build: 'complete_milestone',
          learn: 'complete_module',
          community: 'reply_discussion',
          brand: 'strengthen_brand',
        };
        return {
          hub: item.hub,
          kind: hubToKind[item.hub] ?? 'strengthen_brand',
          data: { title: item.title, description: item.description || '' },
          due: item.due_at ? formatDue(item.due_at, t) : null,
          urgent: item.urgent,
        };
      });

      const spotlight = {
        name: umojaProject?.name || 'Umoja Weavers',
        tagKey: 'featured' as const,
        desc: umojaProject?.description || 'Textile collective · natural indigo dyeing',
        place: umojaProject?.place || 'Nairobi, Kenya',
        ms: umojaProject?.ms || 4,
        msTotal: umojaProject?.ms_total || 6,
        pct: umojaProject?.pct || 67,
        team: Array.isArray(umojaProject?.team)
          ? umojaProject.team.map((tt) => [tt.name, tt.tint] as [string, string])
          : [],
      };

      const feed = raw.feed.map((item) => {
        const hubToFeedKind: Record<string, 'launched_discussion' | 'completed_module' | 'milestone_validated' | 'brand_progressed'> = {
          community: 'launched_discussion',
          learn: 'completed_module',
          build: 'milestone_validated',
          brand: 'brand_progressed',
        };
        return {
          av: (item.av
            ? [item.av.initials || 'AO', item.av.tint || '#FFC72C']
            : ['AO', '#FFC72C']) as [string, string],
          hub: item.hub,
          kind: hubToFeedKind[item.hub] ?? 'launched_discussion',
          data: { who: item.who, what: item.what, detail: item.detail || '' },
          when: formatWhen(item.created_at, t),
          place: item.place || '',
        };
      });

      initialData = {
        member,
        coop: raw.coopName,
        place: raw.coopPlace,
        notifications: 4,
        pulse,
        actions,
        spotlight,
        feed,
      };
    }
  } catch (err: unknown) {
    console.error('[dashboard] fatal fallback:', err);
    // Outer catch — `t` may not be in scope if getTranslations threw first.
    // Build a minimal fallback with English keys directly.
    initialData = buildFallbackData((k: string) => {
      const map: Record<string, string> = {
        min: 'min', h: 'h', yesterday: 'yesterday', tomorrow: 'Tomorrow',
        overdue: 'Overdue', days: 'days', justNow: 'just now', today: 'Today',
      };
      return map[k] ?? k;
    });
  }

  return <DashboardClientPage initialData={initialData} />;
}
