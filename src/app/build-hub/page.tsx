import { createServerClient } from '@/lib/supabase/server';
import BuildHubClientPage, {
  Milestone,
  SpotlightProject,
  BuildCategory,
  BuildProject,
} from './BuildHubClientPage';

export const revalidate = 0;

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

// --- D3 DRIFT NOTE (ADR-META-001) ---
// The spec said 5/17/40/111, but the actual schema (0011_build_hub_v2_seed.sql)
// has 5 categories / 17 projects / 48 phases / 141 tasks.
// We follow the schema, not the spec, per D1+D3.
// Columns: `desc` (quoted lowercase, not `description`), `title` (not `name`).
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

export default async function BuildHubPage() {
  const supabase = await createServerClient();

  // 1. Récupération de l'organisation par défaut (per-tenant, build_milestones only)
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', 'umoja-weavers')
    .single();

  const orgId = org?.id || '11111111-1111-1111-1111-111111111111';

  // 2. Récupération des projets de spotlight (per-tenant, D4 coexistence with build_milestones)
  const { data: dbProjects } = await supabase
    .from('spotlight_projects')
    .select('*')
    .eq('org_id', orgId);

  // 3. Récupération des jalons de build (per-tenant, ADR-ABCOS-001 D10)
  const { data: dbMilestones } = await supabase
    .from('build_milestones')
    .select('*')
    .eq('org_id', orgId)
    .order('sort_order', { ascending: true });

  // 4. Catégories du catalogue partagé Build Hub v2 (D10: SHARED CATALOG, no org_id)
  const { data: dbCategories } = await supabase
    .from('build_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // 5. Hiérarchie imbriquée projets > phases > tâches (D10 shared catalog)
  //    Mirror du pattern learn/page.tsx mais avec la chaîne FK build_*
  const { data: dbProjectsCatalog } = await supabase
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
    .order('sort_order', { ascending: true });

  // --- Mapping vers les types attendus par l'UI Client ---

  const projects: SpotlightProject[] = ((dbProjects as unknown as DBSpotlightProject[]) || []).map((p) => ({
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

  const milestones: Milestone[] = ((dbMilestones as unknown as DBBuildMilestone[]) || []).map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description || null,
    status: m.status,
    dueDate: m.due_date || null,
  }));

  const categories: BuildCategory[] = ((dbCategories as unknown as DBBuildCategory[]) || []).map((cat) => ({
    id: cat.id,
    title: cat.title,
    desc: cat.desc || '',
    icon: cat.icon || '',
    accent: cat.accent || '',
  }));

  const catalogProjects: BuildProject[] = ((dbProjectsCatalog as unknown as DBBuildProject[]) || []).map((p) => {
    // Tri local pour garantir l'ordre chronologique (D4 no self-contradiction)
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

  return (
    <BuildHubClientPage
      projects={projects}
      milestones={milestones}
      categories={categories}
      catalogProjects={catalogProjects}
    />
  );
}
