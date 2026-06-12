import { createServerClient } from '@/lib/supabase/server';
import DashboardClientPage from './DashboardClientPage';
import { AppData } from '@/types';

export const revalidate = 0;

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

function formatWhen(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} min`;
  }
  if (diffHours < 24) {
    return `${diffHours} h`;
  }
  return 'hier';
}

function formatDue(dateStr: string) {
  const diffMs = new Date(dateStr).getTime() - Date.now();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 0) return 'En retard';
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins} min`;
  }
  if (diffHours < 24) {
    return 'Demain';
  }
  return `${Math.floor(diffHours / 24)} jours`;
}

export default async function DashboardPage() {
  const supabase = await createServerClient();

  // 1. Récupération de l'organisation Umoja Weavers
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, place')
    .eq('slug', 'umoja-weavers')
    .single();

  const orgId = org?.id || '11111111-1111-1111-1111-111111111111';
  const coopName = org?.name || 'Umoja Weavers';
  const coopPlace = org?.place || 'Nairobi, Kenya';

  // 2. Requêtes parallèles pour toutes les données du dashboard
  const [
    { data: dbMembers },
    { data: dbPulse },
    { data: dbActions },
    { data: dbSpotlight },
    { data: dbFeed }
  ] = await Promise.all([
    supabase.from('members').select('*').eq('org_id', orgId),
    supabase.from('hub_pulse').select('hub, payload').eq('org_id', orgId),
    supabase.from('action_items').select('*').eq('org_id', orgId).order('due_at', { ascending: true }),
    supabase.from('spotlight_projects').select('*').eq('org_id', orgId),
    supabase.from('feed_items').select('*').eq('org_id', orgId).order('created_at', { ascending: false })
  ]);

  // 3. Extraction du membre principal (Amara Okonkwo)
  const castedMembers = (dbMembers || []) as unknown as DBMember[];
  const defaultMember = castedMembers.find(m => m.name.includes('Amara')) || castedMembers[0] || {
    name: 'Amara okonkwo',
    initials: 'AO',
    tint: 'linear-gradient(150deg,#FFC72C,#E57373)'
  };

  const member = {
    name: defaultMember.name.split(' ')[0],
    full: defaultMember.name,
    initials: defaultMember.initials || 'AO',
    tint: defaultMember.tint || 'linear-gradient(150deg,#FFC72C,#E57373)'
  };

  // 4. Reconstruction du Pulse des Hubs
  const pulsesMap: Record<string, HubPulsePayload> = {};
  ((dbPulse as unknown as DBPulseItem[]) || []).forEach(p => {
    pulsesMap[p.hub] = p.payload;
  });

  const castedSpotlight = (dbSpotlight || []) as unknown as DBSpotlightProject[];
  const spotlightProject = castedSpotlight.find(p => p.name === 'Solaris Agri-Coop') || castedSpotlight[0];
  const umojaProject = castedSpotlight.find(p => p.name === 'Umoja Weavers') || castedSpotlight[1];

  const pulse = {
    community: {
      count: `${pulsesMap.community?.threads || 4} discussions`,
      meta: `${pulsesMap.community?.events || 2} événements à venir · #Legal #Startup actifs`
    },
    learn: {
      course: 'Architect Principles',
      pct: 60,
      meta: `${pulsesMap.learn?.inProgress || 3} en cours · ${pulsesMap.learn?.completed || 2} terminés`
    },
    build: {
      project: spotlightProject?.name || 'Solaris Agri-Coop',
      ms: spotlightProject?.ms || 3,
      msTotal: spotlightProject?.ms_total || 5,
      meta: 'Prochain : Irrigation solaire',
      team: Array.isArray(spotlightProject?.team) ? spotlightProject.team.map((t) => [t.name, t.tint] as [string, string]) : []
    },
    brand: {
      score: pulsesMap.brand?.score || 85,
      delta: pulsesMap.brand?.delta || 4
    }
  };

  // 5. Reconstruction des Actions
  const actions = ((dbActions as unknown as DBActionItem[]) || []).map((item) => ({
    hub: item.hub,
    t: item.title,
    d: item.description || '',
    due: item.due_at ? formatDue(item.due_at) : null,
    urgent: item.urgent
  }));

  // 6. Reconstruction du Spotlight
  const spotlight = {
    name: umojaProject?.name || 'Umoja Weavers',
    tag: umojaProject?.tag || 'PROJET VEDETTE',
    desc: umojaProject?.description || 'Collectif textile · teinture naturelle indigo',
    place: umojaProject?.place || 'Nairobi, Kenya',
    ms: umojaProject?.ms || 4,
    msTotal: umojaProject?.ms_total || 6,
    pct: umojaProject?.pct || 67,
    team: Array.isArray(umojaProject?.team) ? umojaProject.team.map((t) => [t.name, t.tint] as [string, string]) : []
  };

  // 7. Reconstruction du Feed d'activités
  const feed = ((dbFeed as unknown as DBFeedItem[]) || []).map((item) => ({
    who: item.who,
    av: (item.av ? [item.av.initials || 'AO', item.av.tint || '#FFC72C'] : ['AO', '#FFC72C']) as [string, string],
    hub: item.hub,
    what: item.what,
    detail: item.detail || '',
    when: formatWhen(item.created_at),
    place: item.place || ''
  }));

  const initialData: AppData = {
    member,
    coop: coopName,
    place: coopPlace,
    notifications: 4,
    pulse,
    actions,
    spotlight,
    feed
  };

  return <DashboardClientPage initialData={initialData} />;
}
