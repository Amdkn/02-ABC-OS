-- Migration 0001: L2 Mesh — first inter-SOA interconnection protocol
-- ADR: _SPECS/ADR/ADR-L2-MESH-001_l2-mesh-postgres-protocol.md
-- Date: 2026-06-11 | Status: ACCEPTED (A0 ratified via AskUserQuestion)
-- Pattern: 3 tables (messages, tasks, swarm_pulses) + 2 enums (soa, agent_level) + RLS transparency
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS everywhere; DO $ ... $ for enums)

-- ============================================================================
-- 0. SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS l2_mesh;
COMMENT ON SCHEMA l2_mesh IS 'L2 Business OS inter-SOA interconnection protocol. ADR-L2-MESH-001.';

-- ============================================================================
-- 1. ENUMS (idempotent via DO $ ... $ blocks)
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE l2_mesh.soa AS ENUM (
    'soa01_people', 'soa02_it', 'soa03_operations', 'soa04_product',
    'soa05_growth', 'soa06_finance', 'soa07_legal', 'soa08_sales'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE l2_mesh.agent_level AS ENUM ('A0', 'A1', 'A2', 'A3');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- 2.1 Messages: inter-SOA direct async (B2<->B2, B2<->B1)
CREATE TABLE IF NOT EXISTS l2_mesh.messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_soa   l2_mesh.soa NOT NULL,
  to_soa     l2_mesh.soa NOT NULL,
  payload    JSONB NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','delivered','acked','expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acked_at   TIMESTAMPTZ
);
COMMENT ON TABLE l2_mesh.messages IS 'Inter-SOA direct async messages. B1<->B2<->B2.';

-- 2.2 Tasks: cross-SOA work items (B3-level, JTBD-scoped)
CREATE TABLE IF NOT EXISTS l2_mesh.tasks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by_soa l2_mesh.soa NOT NULL,
  assigned_to_soa  l2_mesh.soa NOT NULL,
  jtbd_id          TEXT,
  title            TEXT NOT NULL,
  payload          JSONB,
  priority         INT  NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status           TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','in_progress','blocked','done','cancelled')),
  due_at           TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ
);
COMMENT ON TABLE l2_mesh.tasks IS 'Cross-SOA work items (B3-level). Linked to Picard JTBD via jtbd_id.';

-- 2.3 Swarm pulses: heartbeat of each SOA swarm (1 row per SOA, upsert on tick)
CREATE TABLE IF NOT EXISTS l2_mesh.swarm_pulses (
  soa                l2_mesh.soa PRIMARY KEY,
  last_tick_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_squad_count INT NOT NULL DEFAULT 0,
  last_jtbd_done     TEXT,
  pulse              JSONB
);
COMMENT ON TABLE l2_mesh.swarm_pulses IS 'SOA swarm heartbeat. Upserted on tick. Encodes A0-A3 level in pulse JSONB.';

-- ============================================================================
-- 3. INDEXES (hot paths)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_messages_to_pending
  ON l2_mesh.messages (to_soa, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_open
  ON l2_mesh.tasks (assigned_to_soa, status) WHERE status IN ('open','in_progress');
CREATE INDEX IF NOT EXISTS idx_swarm_pulses_recent
  ON l2_mesh.swarm_pulses (last_tick_at DESC);

-- ============================================================================
-- 4. RLS — transparency read, admin-only write
-- ============================================================================
ALTER TABLE l2_mesh.messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE l2_mesh.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE l2_mesh.swarm_pulses     ENABLE ROW LEVEL SECURITY;

-- Transparency: any authenticated can read all
DROP POLICY IF EXISTS messages_all_read         ON l2_mesh.messages;
DROP POLICY IF EXISTS tasks_all_read            ON l2_mesh.tasks;
DROP POLICY IF EXISTS swarm_pulses_all_read     ON l2_mesh.swarm_pulses;
CREATE POLICY messages_all_read         ON l2_mesh.messages     FOR SELECT TO authenticated USING (true);
CREATE POLICY tasks_all_read            ON l2_mesh.tasks        FOR SELECT TO authenticated USING (true);
CREATE POLICY swarm_pulses_all_read     ON l2_mesh.swarm_pulses FOR SELECT TO authenticated USING (true);

-- Write: only aspace_admin (Postgres role, not JWT). Anon and authenticated JWTs blocked.
DROP POLICY IF EXISTS messages_no_jwt_write         ON l2_mesh.messages;
DROP POLICY IF EXISTS tasks_no_jwt_write            ON l2_mesh.tasks;
DROP POLICY IF EXISTS swarm_pulses_no_jwt_write     ON l2_mesh.swarm_pulses;
CREATE POLICY messages_no_jwt_write     ON l2_mesh.messages     FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY tasks_no_jwt_write        ON l2_mesh.tasks        FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY swarm_pulses_no_jwt_write ON l2_mesh.swarm_pulses FOR INSERT TO authenticated WITH CHECK (false);

-- ============================================================================
-- 5. GRANTS — aspace_admin (per ADR-ABCOS-001 D5 pattern)
-- ============================================================================
GRANT USAGE ON SCHEMA l2_mesh TO aspace_admin;
GRANT ALL  ON ALL TABLES    IN SCHEMA l2_mesh TO aspace_admin;
GRANT ALL  ON ALL SEQUENCES IN SCHEMA l2_mesh TO aspace_admin;

-- ============================================================================
-- 6. SEED — 3 first SOA swarm pulses (Phase 1 smoke test per ADR D5)
-- ============================================================================
INSERT INTO l2_mesh.swarm_pulses (soa, active_squad_count, pulse) VALUES
  ('soa01_people',     0, '{"squad":"X-Men",        "level":"A2","manager":"Green Lantern","status":"standby"}'::jsonb),
  ('soa03_operations', 0, '{"squad":"Fantastic Four","level":"A2","manager":"Batman",       "status":"standby"}'::jsonb),
  ('soa04_product',    0, '{"squad":"Avengers",     "level":"A2","manager":"Flash",        "status":"standby"}'::jsonb)
ON CONFLICT (soa) DO NOTHING;

-- ============================================================================
-- 7. MIGRATIONS TRACKER
-- ============================================================================
CREATE TABLE IF NOT EXISTS l2_mesh._l2_mesh_migrations (
  filename   TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checksum   TEXT
);
INSERT INTO l2_mesh._l2_mesh_migrations (filename) VALUES ('0001_init_mesh.sql')
  ON CONFLICT (filename) DO NOTHING;
