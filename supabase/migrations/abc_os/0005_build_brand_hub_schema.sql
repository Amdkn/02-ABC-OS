-- Migration 0005: Build Hub (milestones) + Brand Hub (collective identity score) schemas
-- Idempotent: safe to re-run
-- Per-tenant tables (org_id FK to abc_os.organizations)

-- ============================================================================
-- 1. BUILD HUB: build_milestones
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE abc_os.milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
COMMENT ON TYPE abc_os.milestone_status IS 'Build Hub: milestone state machine.';

CREATE TABLE IF NOT EXISTS abc_os.build_milestones (
  id           TEXT PRIMARY KEY,
  org_id       UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  status       abc_os.milestone_status NOT NULL DEFAULT 'pending',
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.build_milestones IS 'Build Hub: project milestones per org. Distinct from spotlight_projects (the "project" is in spotlight_projects, milestones live here).';

CREATE INDEX IF NOT EXISTS idx_build_milestones_org      ON abc_os.build_milestones(org_id);
CREATE INDEX IF NOT EXISTS idx_build_milestones_status   ON abc_os.build_milestones(org_id, status);
CREATE INDEX IF NOT EXISTS idx_build_milestones_sort     ON abc_os.build_milestones(org_id, sort_order);

DO $$ BEGIN
  CREATE TRIGGER trg_build_milestones_updated_at
    BEFORE UPDATE ON abc_os.build_milestones
    FOR EACH ROW EXECUTE FUNCTION abc_os.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 2. BRAND HUB: brand_scores (time-series of collective identity score)
-- ============================================================================

CREATE TABLE IF NOT EXISTS abc_os.brand_scores (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES abc_os.organizations(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  delta        INTEGER NOT NULL DEFAULT 0,  -- change vs previous snapshot
  notes        TEXT,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
COMMENT ON TABLE abc_os.brand_scores IS 'Brand Hub: collective identity score history per org. One row per snapshot (chartable).';

CREATE INDEX IF NOT EXISTS idx_brand_scores_org      ON abc_os.brand_scores(org_id);
CREATE INDEX IF NOT EXISTS idx_brand_scores_recorded ON abc_os.brand_scores(org_id, recorded_at DESC);

-- UNIQUE (org_id, recorded_at) ensures one snapshot per (org, instant). Required
-- because the PK is on `id` (UUID) — bare `ON CONFLICT DO NOTHING` would never
-- fire and re-running 0007 would duplicate rows. See ADR-ABCOS-001 D5.
DO $i$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'brand_scores_org_recorded_uniq') THEN
    ALTER TABLE abc_os.brand_scores
      ADD CONSTRAINT brand_scores_org_recorded_uniq UNIQUE (org_id, recorded_at);
  END IF;
END $i$;

-- ============================================================================
-- 3. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0005_build_brand_hub_schema.sql')
  ON CONFLICT (filename) DO NOTHING;
