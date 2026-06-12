-- Migration 0002: RLS policies for abc_os (Phase 1 P1.2)
-- ADR: _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md D5
-- Date: 2026-06-10 | Status: PROPOSED (not yet executed, awaiting HITL A0)
-- Pattern: 5 policy templates per table (select_member / insert_admin / update_admin / delete_owner / anon=NONE)

-- ============================================================================
-- 0. ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE abc_os.organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.memberships          ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.members              ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.hub_pulse            ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.action_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.spotlight_projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE abc_os.feed_items           ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. HELPER: current_org_id() — JWT claim reader
-- ============================================================================
-- Mirrors OMK/Solaris pattern. Custom Access Token Hook (Phase 3.2) stamps
-- (auth.jwt() ->> 'org_id')::uuid = current_org_id().
CREATE OR REPLACE FUNCTION abc_os.current_org_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'org_id')::uuid
$$;
COMMENT ON FUNCTION abc_os.current_org_id() IS 'Reads org_id from JWT custom claim. Set by Custom Access Token Hook.';

CREATE OR REPLACE FUNCTION abc_os.current_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'
$$;
COMMENT ON FUNCTION abc_os.current_role() IS 'Reads role from JWT custom claim. owner/admin/member/viewer.';

-- ============================================================================
-- 2. POLICY: organizations (admin-only reads for non-public)
-- ============================================================================
DROP POLICY IF EXISTS organizations_select_member ON abc_os.organizations;
CREATE POLICY organizations_select_member ON abc_os.organizations
  FOR SELECT TO authenticated
  USING (id = abc_os.current_org_id());

DROP POLICY IF EXISTS organizations_update_owner ON abc_os.organizations;
CREATE POLICY organizations_update_owner ON abc_os.organizations
  FOR UPDATE TO authenticated
  USING (id = abc_os.current_org_id())
  WITH CHECK (id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- INSERT/DELETE on organizations is reserved to aspace_admin (Postgres role, not JWT).
-- Anon = 0 access.

-- ============================================================================
-- 3. POLICY: memberships (self + admin/owner)
-- ============================================================================
DROP POLICY IF EXISTS memberships_self_select ON abc_os.memberships;
CREATE POLICY memberships_self_select ON abc_os.memberships
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner')
  );

DROP POLICY IF EXISTS memberships_admin_insert ON abc_os.memberships;
CREATE POLICY memberships_admin_insert ON abc_os.memberships
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id = abc_os.current_org_id()
    AND abc_os.current_role() IN ('admin','owner')
  );

DROP POLICY IF EXISTS memberships_admin_update ON abc_os.memberships;
CREATE POLICY memberships_admin_update ON abc_os.memberships
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS memberships_owner_delete ON abc_os.memberships;
CREATE POLICY memberships_owner_delete ON abc_os.memberships
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 4. POLICY: members (org-wide read, admin write)
-- ============================================================================
DROP POLICY IF EXISTS members_select_member ON abc_os.members;
CREATE POLICY members_select_member ON abc_os.members
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS members_admin_insert ON abc_os.members;
CREATE POLICY members_admin_insert ON abc_os.members
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS members_admin_update ON abc_os.members;
CREATE POLICY members_admin_update ON abc_os.members
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS members_owner_delete ON abc_os.members;
CREATE POLICY members_owner_delete ON abc_os.members
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 5. POLICY: hub_pulse (org-wide read, admin write)
-- ============================================================================
DROP POLICY IF EXISTS hub_pulse_select_member ON abc_os.hub_pulse;
CREATE POLICY hub_pulse_select_member ON abc_os.hub_pulse
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS hub_pulse_admin_insert ON abc_os.hub_pulse;
CREATE POLICY hub_pulse_admin_insert ON abc_os.hub_pulse
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS hub_pulse_admin_update ON abc_os.hub_pulse;
CREATE POLICY hub_pulse_admin_update ON abc_os.hub_pulse
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS hub_pulse_owner_delete ON abc_os.hub_pulse;
CREATE POLICY hub_pulse_owner_delete ON abc_os.hub_pulse
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 6. POLICY: action_items (org-wide read, admin write)
-- ============================================================================
DROP POLICY IF EXISTS action_items_select_member ON abc_os.action_items;
CREATE POLICY action_items_select_member ON abc_os.action_items
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS action_items_admin_insert ON abc_os.action_items;
CREATE POLICY action_items_admin_insert ON abc_os.action_items
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS action_items_admin_update ON abc_os.action_items;
CREATE POLICY action_items_admin_update ON abc_os.action_items
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS action_items_owner_delete ON abc_os.action_items;
CREATE POLICY action_items_owner_delete ON abc_os.action_items
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 7. POLICY: spotlight_projects (org-wide read, admin write)
-- ============================================================================
DROP POLICY IF EXISTS spotlight_select_member ON abc_os.spotlight_projects;
CREATE POLICY spotlight_select_member ON abc_os.spotlight_projects
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS spotlight_admin_insert ON abc_os.spotlight_projects;
CREATE POLICY spotlight_admin_insert ON abc_os.spotlight_projects
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS spotlight_admin_update ON abc_os.spotlight_projects;
CREATE POLICY spotlight_admin_update ON abc_os.spotlight_projects
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS spotlight_owner_delete ON abc_os.spotlight_projects;
CREATE POLICY spotlight_owner_delete ON abc_os.spotlight_projects
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 8. POLICY: feed_items (org-wide read, admin write)
-- ============================================================================
DROP POLICY IF EXISTS feed_select_member ON abc_os.feed_items;
CREATE POLICY feed_select_member ON abc_os.feed_items
  FOR SELECT TO authenticated
  USING (org_id = abc_os.current_org_id());

DROP POLICY IF EXISTS feed_admin_insert ON abc_os.feed_items;
CREATE POLICY feed_admin_insert ON abc_os.feed_items
  FOR INSERT TO authenticated
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS feed_admin_update ON abc_os.feed_items;
CREATE POLICY feed_admin_update ON abc_os.feed_items
  FOR UPDATE TO authenticated
  USING (org_id = abc_os.current_org_id())
  WITH CHECK (org_id = abc_os.current_org_id() AND abc_os.current_role() IN ('admin','owner'));

DROP POLICY IF EXISTS feed_owner_delete ON abc_os.feed_items;
CREATE POLICY feed_owner_delete ON abc_os.feed_items
  FOR DELETE TO authenticated
  USING (org_id = abc_os.current_org_id() AND abc_os.current_role() = 'owner');

-- ============================================================================
-- 9. MIGRATIONS TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0002_rls_policies.sql')
  ON CONFLICT (filename) DO NOTHING;
