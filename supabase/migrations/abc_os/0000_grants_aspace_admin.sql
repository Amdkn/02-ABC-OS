-- Migration 0000: Grants for aspace_admin + aspace_observer (Phase 1 P1.0)
-- ADR: _SPECS/ADR/ADR-SUPABASE-001_self-hosted-multi-tenancy-schemas.md D4
-- Date: 2026-06-10 | Status: PROPOSED (not yet executed, awaiting HITL A0)
-- Apply order: BEFORE 0001 (creates the schema), 0003 (RLS), 0004 (seed)
-- Idempotent: safe to re-run (schema IF NOT EXISTS + GRANTs re-applied)

-- ============================================================================
-- 0. SAFETY: ensure schema exists so GRANTs have a target
-- ============================================================================
-- 0001 will create it; this is a belt-and-suspenders for partial-apply recovery.
CREATE SCHEMA IF NOT EXISTS abc_os;

-- ============================================================================
-- 1. SCHEMA USAGE — gate to read object names (see 05_supabase/AGENTS.md W3)
-- ============================================================================
-- USAGE on the schema is NOT enough to read tables. We also need table-level
-- GRANTs (per-table SELECT/INSERT/UPDATE/DELETE) AND the row-level RLS
-- policies in 0003. This is the W3 gotcha: schema USAGE ≠ table access.

GRANT USAGE ON SCHEMA abc_os TO aspace_admin;
GRANT USAGE ON SCHEMA abc_os TO aspace_observer;
-- PostgREST exposure (W3 doctrine): the authenticator role connects to the DB
-- on behalf of anon/authenticated/service_role. Without USAGE on the schema,
-- PostgREST's schema cache (and therefore URL routing) cannot see the tables,
-- even when the schema is in PGRST_DB_SCHEMAS. RLS still gates row-level access.
GRANT USAGE ON SCHEMA abc_os TO authenticator;
GRANT USAGE ON SCHEMA abc_os TO authenticated;
GRANT USAGE ON SCHEMA abc_os TO service_role;

COMMENT ON SCHEMA abc_os IS 'ABC OS Community — multi-tenant (org_id + RLS). aspace_admin = VPS-side service role (write ops). aspace_observer = read-only. See ADR-SUPABASE-001 D4.';

-- ============================================================================
-- 2. DEFAULT PRIVILEGES — auto-grant on FUTURE tables in abc_os
-- ============================================================================
-- When 0001 creates new tables, aspace_admin should automatically get full DML
-- (bypassing RLS, which only kicks in for the anon/authenticated roles).
-- ALTER DEFAULT PRIVILEGES only affects FUTURE objects, not existing ones
-- (existing tables are handled in 0001 via explicit GRANT, or here below).

-- 2.1 aspace_admin = full DML on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA abc_os
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO aspace_admin;

-- 2.2 aspace_admin = USAGE + SELECT on future sequences (for SERIAL/BIGSERIAL)
ALTER DEFAULT PRIVILEGES IN SCHEMA abc_os
  GRANT USAGE, SELECT ON SEQUENCES TO aspace_admin;

-- 2.3 aspace_observer = read-only on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA abc_os
  GRANT SELECT ON TABLES TO aspace_observer;

-- ============================================================================
-- 3. EXISTING-TABLE GRANTS — for the _aspace_migrations tracker only
-- ============================================================================
-- 0001 will create 7 tables + 1 _aspace_migrations. Default privileges cover
-- the 7 main tables, but _aspace_migrations is the audit trail and needs an
-- explicit grant NOW so aspace_admin can INSERT into it during 0001's tail.
-- (Once 0001 runs, all 8 tables fall under the default-privileges umbrella.)

-- Defer the explicit grant to a post-0001 step (handled by apply-abc-os-migrations.sh
-- via a second psql pass). The 0001 migration itself runs as `postgres` superuser,
-- so it can INSERT without aspace_admin needing the grant yet.

-- ============================================================================
-- 4. MIGRATIONS TRACKER
-- ============================================================================
-- 0000 must NOT add itself to _aspace_migrations, because that table does not
-- exist yet (0001 creates it). Instead, 0001's final block inserts ('0000_…')
-- on behalf of 0000. This is the canonical pattern: tracker row written by
-- the migration that creates the tracker.

-- This file is a 0000 only by NAMING — the tracker record ('0000_grants_…')
-- is written by 0001's tail block (see 0001_init_schema.sql end).
