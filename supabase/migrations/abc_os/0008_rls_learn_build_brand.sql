-- Migration 0008: RLS policies for the 6 tables added in 0004-0005
-- ADR: _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md D5
-- Date: 2026-06-11
-- Pattern matches 0002_rls_policies.sql (DROP IF EXISTS + CREATE).
-- Two policy families:
--   1. Shared catalog (learn_*) — read for any authenticated user, writes reserved to aspace_admin
--   2. Per-tenant (build_milestones, brand_scores) — same pattern as 0002 §4-8

-- ============================================================================
-- 0. ENABLE RLS ON THE 6 NEW TABLES
-- ============================================================================
ALTER TABLE abc_os.learn_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.learn_courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.learn_modules    ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.learn_chapters   ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.build_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.brand_scores     ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. SHARED CATALOG: learn_categories (all 4 tables follow the same pattern)
-- ============================================================================
-- Any authenticated user may read the shared catalog. Writes (catalog curation)
-- are reserved to the aspace_admin Postgres role — they bypass RLS and are
-- not granted to JWT-scoped roles. This protects the curriculum from
-- tenant-side tampering while keeping it universally readable.

-- 1.1 learn_categories
DROP POLICY IF EXISTS learn_categories_select_auth ON abc_os.learn_categories;
CREATE POLICY learn_categories_select_auth ON abc_os.learn_categories
  FOR SELECT TO authenticated
  USING (true);

-- 1.2 learn_courses
DROP POLICY IF EXISTS learn_courses_select_auth ON abc_os.learn_courses;
CREATE POLICY learn_courses_select_auth ON abc_os.learn_courses
  FOR SELECT TO authenticated
  USING (true);

-- 1.3 learn_modules
DROP POLICY IF EXISTS learn_modules_select_auth ON abc_os.learn_modules;
CREATE POLICY learn_modules_select_auth ON abc_os.learn_modules
  FOR SELECT TO authenticated
  USING (true);

-- 1.4 learn_chapters
DROP POLICY IF EXISTS learn_chapters_select_auth ON abc_os.learn_chapters;
CREATE POLICY learn_chapters_select_auth ON abc_os.learn_chapters
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- 2. PER-TENANT: build_milestones (org-wide read, admin/owner write)
-- ============================================================================
DROP POLICY IF EXISTS build_milestones_select_member ON abc_os.build_milestones;
CREATE POLICY build_milestones_select_member ON abc_os.build_milestones
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS build_milestones_admin_insert ON abc_os.build_milestones;
CREATE POLICY build_milestones_admin_insert ON abc_os.build_milestones
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS build_milestones_admin_update ON abc_os.build_milestones;
CREATE POLICY build_milestones_admin_update ON abc_os.build_milestones
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS build_milestones_owner_delete ON abc_os.build_milestones;
CREATE POLICY build_milestones_owner_delete ON abc_os.build_milestones
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 3. PER-TENANT: brand_scores (org-wide read, admin/owner write; append-only by design)
-- ============================================================================
-- Append-only time-series: members read, admin/owner can append a new snapshot.
-- Updates/deletes are owner-only to preserve audit trail integrity.
DROP POLICY IF EXISTS brand_scores_select_member ON abc_os.brand_scores;
CREATE POLICY brand_scores_select_member ON abc_os.brand_scores
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS brand_scores_admin_insert ON abc_os.brand_scores;
CREATE POLICY brand_scores_admin_insert ON abc_os.brand_scores
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS brand_scores_owner_update ON abc_os.brand_scores;
CREATE POLICY brand_scores_owner_update ON abc_os.brand_scores
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

DROP POLICY IF EXISTS brand_scores_owner_delete ON abc_os.brand_scores;
CREATE POLICY brand_scores_owner_delete ON abc_os.brand_scores
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 4. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0008_rls_learn_build_brand.sql')
  ON CONFLICT (filename) DO NOTHING;
