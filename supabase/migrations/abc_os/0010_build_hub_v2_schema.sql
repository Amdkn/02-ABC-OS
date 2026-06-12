-- Migration 0010: Build Hub v2 schema (4 shared catalog tables)
-- Source of truth: apps/abc-os-community/src/data/buildData.ts
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS everywhere)
-- Hierarchy: build_categories > build_projects > build_phases > build_tasks
-- Mixed-tenancy (D10 — ADR-ABCOS-001): SHARED CATALOG (no org_id), mirrors Learn Hub pattern.
-- Coexistence: build_milestones (per-tenant, D4) lives alongside these 4 tables.
-- Date: 2026-06-12

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 build_categories (5 rows expected: homesteading, architecture, offgrid, micro_revenue, agentic_build)
CREATE TABLE IF NOT EXISTS abc_os.build_categories (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  "desc"      TEXT NOT NULL,
  icon        TEXT NOT NULL,
  accent      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.build_categories IS 'Build Hub v2: top-level physical-project categories. Shared catalog (no org_id) per ADR-ABCOS-001 D10. Maps 1:1 to BUILD_CATEGORIES in buildData.ts.';

-- 1.2 build_projects (17 rows expected, distributed across the 5 categories)
CREATE TABLE IF NOT EXISTS abc_os.build_projects (
  id           TEXT PRIMARY KEY,
  category_id  TEXT NOT NULL REFERENCES abc_os.build_categories(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  sub          TEXT NOT NULL,
  "desc"       TEXT NOT NULL,
  progress     INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  icon         TEXT NOT NULL,
  accent       TEXT NOT NULL,
  tasks_count  INTEGER NOT NULL DEFAULT 0,
  duration     TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.build_projects IS 'Build Hub v2: physical project templates (homesteading, architecture, offgrid, micro_revenue, agentic_build). Shared catalog. progress is a denormalized hint (real progress per-user = future table, out of scope D10).';

-- 1.3 build_phases (2-4 per project; project_id FK with ON DELETE CASCADE)
CREATE TABLE IF NOT EXISTS abc_os.build_phases (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL REFERENCES abc_os.build_projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.build_phases IS 'Build Hub v2: phases within a project. ~2-4 per project. Shared catalog.';

-- 1.4 build_tasks (2-6 per phase; phase_id FK with ON DELETE CASCADE; no status — per-user = future)
CREATE TABLE IF NOT EXISTS abc_os.build_tasks (
  id          TEXT PRIMARY KEY,
  phase_id    TEXT NOT NULL REFERENCES abc_os.build_phases(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  duration    TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.build_tasks IS 'Build Hub v2: tasks within a phase. Atomic execution unit. Shared catalog. Per-user status (pending/in_progress/completed) deferred to a future per-user table (D10 out of scope).';

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_build_projects_category   ON abc_os.build_projects(category_id);
CREATE INDEX IF NOT EXISTS idx_build_projects_sort       ON abc_os.build_projects(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_build_phases_project      ON abc_os.build_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_build_phases_sort         ON abc_os.build_phases(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_build_tasks_phase         ON abc_os.build_tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_build_tasks_sort          ON abc_os.build_tasks(phase_id, sort_order);

-- ============================================================================
-- 3. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0010_build_hub_v2_schema.sql')
  ON CONFLICT (filename) DO NOTHING;
