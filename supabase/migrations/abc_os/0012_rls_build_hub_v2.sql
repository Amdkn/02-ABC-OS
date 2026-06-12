-- Migration 0012: RLS policies for the 4 new build_hub_v2 tables (added in 0010)
-- ADR: _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md D10
-- Date: 2026-06-12
-- Pattern matches 0008 §1: DROP IF EXISTS + CREATE, TO authenticated USING (true)
-- Mixed-tenancy model: build_hub_v2 is SHARED CATALOG (D10) — no org_id, universal read.
-- Coexistence: build_milestones (per-tenant, D4) keeps its own 4-policy family in 0008.

-- ============================================================================
-- 0. ENABLE RLS ON THE 4 NEW TABLES
-- ============================================================================
ALTER TABLE abc_os.build_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.build_projects    ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.build_phases      ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.build_tasks       ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. SHARED CATALOG: build_categories, build_projects, build_phases, build_tasks
-- ============================================================================
-- Any authenticated user may read the shared catalog. Writes (catalog curation)
-- are reserved to the aspace_admin Postgres role — they bypass RLS and are
-- not granted to JWT-scoped roles. This protects the physical-project templates
-- from tenant-side tampering while keeping them universally readable.

-- 1.1 build_categories
DROP POLICY IF EXISTS build_categories_select_auth ON abc_os.build_categories;
CREATE POLICY build_categories_select_auth ON abc_os.build_categories
  FOR SELECT TO authenticated
  USING (true);

-- 1.2 build_projects
DROP POLICY IF EXISTS build_projects_select_auth ON abc_os.build_projects;
CREATE POLICY build_projects_select_auth ON abc_os.build_projects
  FOR SELECT TO authenticated
  USING (true);

-- 1.3 build_phases
DROP POLICY IF EXISTS build_phases_select_auth ON abc_os.build_phases;
CREATE POLICY build_phases_select_auth ON abc_os.build_phases
  FOR SELECT TO authenticated
  USING (true);

-- 1.4 build_tasks
DROP POLICY IF EXISTS build_tasks_select_auth ON abc_os.build_tasks;
CREATE POLICY build_tasks_select_auth ON abc_os.build_tasks
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- 2. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0012_rls_build_hub_v2.sql')
  ON CONFLICT (filename) DO NOTHING;
