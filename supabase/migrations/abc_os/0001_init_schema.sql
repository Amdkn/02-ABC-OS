-- Migration 0001: Init abc_os schema (Phase 1 P1.1)
-- ADR: _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md
-- Date: 2026-06-10 | Status: PROPOSED (not yet executed, awaiting HITL A0)
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS everywhere)

-- ============================================================================
-- 0. SCHEMA + EXTENSIONS
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS abc_os;
COMMENT ON SCHEMA abc_os IS 'ABC OS Community — multi-tenant (org_id + RLS). See ADR-ABCOS-001.';

-- pgcrypto for gen_random_uuid() (if not already enabled at supabase-db level)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. ENUMS
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE abc_os.hub AS ENUM ('community', 'learn', 'build', 'brand');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
COMMENT ON TYPE abc_os.hub IS '4-hub model: Community / Learn / Build / Brand. See ActionItem.hub.';

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- 2.1 organizations (the tenant)
CREATE TABLE IF NOT EXISTS abc_os.organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  place       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.organizations IS 'The tenant = one cooperative. One row per coop.';

-- 2.2 memberships (user <-> org N:N with role)
CREATE TABLE IF NOT EXISTS abc_os.memberships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id      UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('owner','admin','member','viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, org_id)
);
COMMENT ON TABLE abc_os.memberships IS 'User-to-Org N:N. A user can be in N coops. role drives RLS WITH CHECK.';

-- 2.3 members (denormalized profile inside an org for dashboard rendering)
CREATE TABLE IF NOT EXISTS abc_os.members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  full_name   TEXT,
  initials    TEXT,
  tint        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.members IS 'Dashboard member card. user_id nullable for non-logged-in display.';

-- 2.4 hub_pulse (the 4-hub pulse widget data)
CREATE TABLE IF NOT EXISTS abc_os.hub_pulse (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  hub         abc_os.hub NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.hub_pulse IS 'One row per (org, hub) at minimum. payload is hub-specific shape.';

-- 2.5 action_items
CREATE TABLE IF NOT EXISTS abc_os.action_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  hub          abc_os.hub NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  due_at       TIMESTAMPTZ,
  urgent       BOOLEAN NOT NULL DEFAULT false,
  assignee_id  UUID REFERENCES abc_os.members(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.action_items IS 'Action item widget. assignee -> members.id (within same org).';

-- 2.6 spotlight_projects
CREATE TABLE IF NOT EXISTS abc_os.spotlight_projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  tag          TEXT,
  description  TEXT,
  place        TEXT,
  ms           INTEGER NOT NULL DEFAULT 0,  -- milestone index
  ms_total     INTEGER NOT NULL DEFAULT 0,  -- total milestones
  pct          INTEGER NOT NULL DEFAULT 0,  -- 0-100
  team         JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.spotlight_projects IS 'Spotlight project card. team = JSONB array of {name, avatar}.';

-- 2.7 feed_items
CREATE TABLE IF NOT EXISTS abc_os.feed_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  who         TEXT NOT NULL,
  av          JSONB NOT NULL DEFAULT '{}'::jsonb,
  hub         abc_os.hub NOT NULL,
  what        TEXT NOT NULL,
  detail      TEXT,
  when_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  place       TEXT
);
COMMENT ON TABLE abc_os.feed_items IS 'Activity feed. JSONB avatar (initials + tint).';

-- ============================================================================
-- 3. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON abc_os.organizations(slug);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON abc_os.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org_id  ON abc_os.memberships(org_id);

CREATE INDEX IF NOT EXISTS idx_members_org_id ON abc_os.members(org_id);

CREATE INDEX IF NOT EXISTS idx_hub_pulse_org_id      ON abc_os.hub_pulse(org_id);
CREATE INDEX IF NOT EXISTS idx_hub_pulse_org_hub     ON abc_os.hub_pulse(org_id, hub);

CREATE INDEX IF NOT EXISTS idx_action_items_org_id   ON abc_os.action_items(org_id);
CREATE INDEX IF NOT EXISTS idx_action_items_org_hub  ON abc_os.action_items(org_id, hub);
CREATE INDEX IF NOT EXISTS idx_action_items_due_at   ON abc_os.action_items(due_at) WHERE due_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_spotlight_org_id ON abc_os.spotlight_projects(org_id);

CREATE INDEX IF NOT EXISTS idx_feed_org_id   ON abc_os.feed_items(org_id);
CREATE INDEX IF NOT EXISTS idx_feed_org_when ON abc_os.feed_items(org_id, when_at DESC);

-- ============================================================================
-- 4. updated_at TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION abc_os.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_hub_pulse_updated_at
    BEFORE UPDATE ON abc_os.hub_pulse
    FOR EACH ROW EXECUTE FUNCTION abc_os.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_spotlight_updated_at
    BEFORE UPDATE ON abc_os.spotlight_projects
    FOR EACH ROW EXECUTE FUNCTION abc_os.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 5. MIGRATIONS TRACKER (per ADR-SUPABASE-001 D3)
-- ============================================================================
CREATE TABLE IF NOT EXISTS abc_os._aspace_migrations (
  id          SERIAL PRIMARY KEY,
  filename    TEXT NOT NULL UNIQUE,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  checksum    TEXT
);
COMMENT ON TABLE abc_os._aspace_migrations IS 'Migration audit trail. INSERT row per migration applied. Per ADR-SUPABASE-001 D3.';

-- 0000 ran before this table existed; back-record it now.
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0000_grants_aspace_admin.sql')
  ON CONFLICT (filename) DO NOTHING;

INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0001_init_schema.sql')
  ON CONFLICT (filename) DO NOTHING;
