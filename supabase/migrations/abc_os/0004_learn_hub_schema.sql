-- Migration 0004: Learn Hub schema (4 tables, shared catalog)
-- Source of truth: apps/abc-os-community/src/data/learnData.ts
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS everywhere)
-- Hierarchy: learn_categories > learn_courses > learn_modules > learn_chapters

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1.1 learn_categories (5 rows expected: structuration, agentic, autodidact, productivity, solarpunk)
CREATE TABLE IF NOT EXISTS abc_os.learn_categories (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  "desc"      TEXT NOT NULL,
  icon        TEXT NOT NULL,
  accent      TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.learn_categories IS 'Learn Hub: top-level categories. Shared catalog (no org_id). Maps 1:1 to LEARN_CATEGORIES in learnData.ts.';

-- 1.2 learn_courses (30 rows expected, 6 per category)
CREATE TABLE IF NOT EXISTS abc_os.learn_courses (
  id            TEXT PRIMARY KEY,
  category_id   TEXT NOT NULL REFERENCES abc_os.learn_categories(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  sub           TEXT NOT NULL,
  "desc"        TEXT NOT NULL,
  progress      INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  icon          TEXT NOT NULL,
  accent        TEXT NOT NULL,
  lessons_count INTEGER NOT NULL DEFAULT 0,
  duration      TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.learn_courses IS 'Learn Hub: courses. Shared catalog. Maps 1:N to LEARN_COURSES in learnData.ts. progress is a denormalized hint (real progress should be per-user, future).';

-- 1.3 learn_modules (~60 rows expected, 2-3 per course)
CREATE TABLE IF NOT EXISTS abc_os.learn_modules (
  id          TEXT PRIMARY KEY,
  course_id   TEXT NOT NULL REFERENCES abc_os.learn_courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.learn_modules IS 'Learn Hub: modules within a course. ~2-3 per course.';

-- 1.4 learn_chapters (~130 rows expected, 2-3 per module)
CREATE TABLE IF NOT EXISTS abc_os.learn_chapters (
  id          TEXT PRIMARY KEY,
  module_id   TEXT NOT NULL REFERENCES abc_os.learn_modules(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  duration    TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE abc_os.learn_chapters IS 'Learn Hub: chapters within a module. Atomic learning unit.';

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_learn_courses_category   ON abc_os.learn_courses(category_id);
CREATE INDEX IF NOT EXISTS idx_learn_courses_sort      ON abc_os.learn_courses(category_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_learn_modules_course    ON abc_os.learn_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_learn_modules_sort      ON abc_os.learn_modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_learn_chapters_module   ON abc_os.learn_chapters(module_id);
CREATE INDEX IF NOT EXISTS idx_learn_chapters_sort     ON abc_os.learn_chapters(module_id, sort_order);

-- ============================================================================
-- 3. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0004_learn_hub_schema.sql')
  ON CONFLICT (filename) DO NOTHING;
