import { createServerClient } from '@/lib/supabase/server';
import BuildHubClientPage, {
  Milestone,
  SpotlightProject,
  BuildCategory,
  BuildProject,
} from './BuildHubClientPage';
import { withTimeout, QueryTimeoutError } from '@/lib/supabase/with-timeout';
import { unstable_cache } from 'next/cache';

export const revalidate = 60;

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

interface DBBuildMilestone {
  id: string;
  name: string;
  description?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  due_date?: string | null;
}

interface DBBuildCategory {
  id: string;
  title: string;
  desc: string | null;
  icon: string;
  accent: string;
  sort_order: number;
}

interface DBBuildTask {
  id: string;
  title: string;
  duration: string;
  sort_order: number;
}

interface DBBuildPhase {
  id: string;
  title: string;
  sort_order: number;
  tasks: DBBuildTask[] | null;
}

interface DBBuildProject {
  id: string;
  category_id: string;
  title: string;
  sub: string;
  desc: string;
  progress: number;
  icon: string;
  accent: string;
  tasks_count: number;
  duration: string;
  sort_order: number;
  phases: DBBuildPhase[] | null;
}

const QUERY_TIMEOUT_MS = 3000;

const loadBuildData = unstable_cache(
  async (): Promise<{
    orgId: string;
    projects: DBSpotlightProject[];
    milestones: DBBuildMilestone[];
    categories: DBBuildCategory[];
    catalog: DBBuildProject[];
  } | null> => {
    try {
      const supabase = await createServerClient();

      const safeQuery = <T,>(p: PromiseLike<T>): Promise<T> =>
        withTimeout(p, QUERY_TIMEOUT_MS).catch((err: unknown) => {
          if (!(err instanceof QueryTimeoutError)) console.warn('[build-hub] query failed:', err);
          return null as T;
        });

      const [orgRes, projectsRes, milestonesRes, categoriesRes, catalogRes] = await Promise.all([
        safeQuery(supabase.from('organizations').select('id').eq('slug', 'umoja-weavers').single()),
        safeQuery(supabase.from('spotlight_projects').select('*').limit(100)),
        safeQuery(supabase.from('build_milestones').select('*').limit(100).order('sort_order', { ascending: true })),
        safeQuery(supabase.from('build_categories').select('*').order('sort_order', { ascending: true })),
        safeQuery(
          supabase
            .from('build_projects')
            .select(`
              id,
              category_id,
              title,
              sub,
              desc,
              progress,
              icon,
              accent,
              tasks_count,
              duration,
              sort_order,
              phases:build_phases (
                id,
                title,
                sort_order,
                tasks:build_tasks (
                  id,
                  title,
                  duration,
                  sort_order
                )
              )
            `)
            .order('sort_order', { ascending: true })
        ),
      ]);

      if (!orgRes) return null;
      const orgData = (orgRes as { data: unknown } | null)?.data as { id: string } | null;
      const orgId = orgData?.id || '11111111-1111-1111-1111-111111111111';

      const projectsData = (projectsRes as { data: unknown } | null)?.data as DBSpotlightProject[] | null;
      const milestonesData = (milestonesRes as { data: unknown } | null)?.data as DBBuildMilestone[] | null;
      const categoriesData = (categoriesRes as { data: unknown } | null)?.data as DBBuildCategory[] | null;
      const catalogData = (catalogRes as { data: unknown } | null)?.data as DBBuildProject[] | null;

      return {
        orgId,
        projects: (projectsData as DBSpotlightProject[]) || [],
        milestones: (milestonesData as DBBuildMilestone[]) || [],
        categories: (categoriesData as DBBuildCategory[]) || [],
        catalog: (catalogData as DBBuildProject[]) || [],
      };
    } catch (err: unknown) {
      console.error('[build-hub] cached fetch failed:', err);
      return null;
    }
  },
  ['build-hub-umoja-weavers-v1'],
  { revalidate: 60, tags: ['build-hub'] }
);

export default async function BuildHubPage() {
  let projects: SpotlightProject[] = [];
  let milestones: Milestone[] = [];
  let categories: BuildCategory[] = [];
  let catalogProjects: BuildProject[] = [];

  try {
    const raw = await loadBuildData();
    if (raw) {
      const orgId = raw.orgId;

      projects = raw.projects
        .filter((p) => !('org_id' in p) || (p as unknown as { org_id?: string }).org_id === orgId)
        .map((p) => ({
          id: p.id,
          name: p.name,
          tag: p.tag || '',
          description: p.description || null,
          place: p.place || null,
          ms: p.ms,
          msTotal: p.ms_total,
          pct: p.pct,
          team: Array.isArray(p.team) ? p.team : [],
        }));

      milestones = raw.milestones
        .filter((m) => !('org_id' in m) || (m as unknown as { org_id?: string }).org_id === orgId)
        .map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description || null,
          status: m.status,
          dueDate: m.due_date || null,
        }));

      categories = raw.categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        desc: cat.desc || '',
        icon: cat.icon || '',
        accent: cat.accent || '',
      }));

      catalogProjects = raw.catalog.map((p) => {
        const sortedPhases = (p.phases || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((ph) => ({
            id: ph.id,
            title: ph.title,
            tasks: (ph.tasks || [])
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((t) => ({
                id: t.id,
                title: t.title,
                duration: t.duration,
              })),
          }));

        return {
          id: p.id,
          categoryId: p.category_id,
          title: p.title,
          sub: p.sub,
          desc: p.desc,
          progress: p.progress,
          icon: p.icon,
          accent: p.accent,
          tasksCount: p.tasks_count,
          duration: p.duration,
          phases: sortedPhases,
        };
      });
    }
  } catch (err: unknown) {
    console.error('[build-hub] fatal fallback:', err);
  }

  return (
    <BuildHubClientPage
      projects={projects}
      milestones={milestones}
      categories={categories}
      catalogProjects={catalogProjects}
    />
  );
}
