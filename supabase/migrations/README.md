---
source: ABC_OS_migrations
date: 2026-06-10
type: ops_readme
domain: L0_Tech_OS / Supabase_VPS / abc_os_schema
tags: [#supabase #migrations #abc_os #hitl]
related: [ADR-ABCOS-001, ADR-SUPABASE-001, 05_supabase/AGENTS.md, handoff_abc_os_community_dev_2026-06-10]
---

# abc_os Migrations — Apply Protocol

> **Status** : 3 migration files written, **NOT YET EXECUTED** on Supabase VPS. Execution = HITL-gated (see below).

## Files (in apply order)

| # | File | Phase | Description |
|---|------|-------|-------------|
| 0 | `0000_grants_aspace_admin.sql` | P1.0 | DCL: `CREATE SCHEMA IF NOT EXISTS` + GRANT USAGE on `abc_os` to `aspace_admin` + `aspace_observer` + ALTER DEFAULT PRIVILEGES for FUTURE tables/sequences. Idempotent. |
| 1 | `0001_init_schema.sql` | P1.1 | CREATE SCHEMA abc_os + 7 tables + indexes + updated_at triggers + `_aspace_migrations` tracker (and a tail INSERT that back-records `0000_…` since the tracker didn't exist when 0000 ran) |
| 2 | `0002_rls_policies.sql` | P1.2 | ENABLE RLS + 5 policy templates per table (select_member / admin insert/update / owner delete) + JWT helpers `current_org_id()`, `current_role()` |
| 3 | `0003_seed_umoja.sql` | P2.1 | DEV-only seed: Umoja Weavers org + 2 users (Amara, Kofi) + memberships + members + hub_pulse + 4 action items + 2 spotlight projects + 4 feed items |

## Apply paths (3 options — pick one)

### Path A — `supabase-aspace` MCP (canonical, future)

Once Stream 3 deliverable lands (the new MCP server in `.mcp_servers/supabase-aspace/`):

```ts
mcp__supabase-aspace__apply_migration({
  schema: 'abc_os',
  file: 'C:/Users/.../apps/abc-os-community/supabase/migrations/abc_os/0000_grants_aspace_admin.sql'
})
```

Repeat for 0001, 0002, 0003. The MCP logs to `abc_os._aspace_migrations` automatically.

### Path B — SSH + docker exec via `apply-abc-os-migrations.sh` (current fallback, A0-blessed)

Per `05_supabase/AGENTS.md` W2-W4. Run from the local dev machine (the script handles the SSH+scp+docker exec sequence + verification):

```bash
# from apps/abc-os-community/
./scripts/apply-abc-os-migrations.sh dev    # safe default — runs 0000-0003
# or for prod (0000-0002 only, 0003 skipped, requires typing GO-PROD):
./scripts/apply-abc-os-migrations.sh prod
```

The script:
1. Verifies SSH alias `aspace-vps` is reachable
2. Confirms `app.env` on the VPS matches the requested target
3. Copies all 4 .sql files to `/tmp/abc-os-migrations/` on the VPS
4. Applies 0000 → 0001 → 0002 → 0003 (dev only) with `-v ON_ERROR_STOP=1`
5. Runs the 5 verification queries and prints results

Manual fallback (if the script is not on the VPS yet):

```bash
scp -r apps/abc-os-community/supabase/migrations/abc_os aspace-vps:/tmp/abc-os-migrations/
ssh aspace-vps 'docker exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < /tmp/abc-os-migrations/0000_grants_aspace_admin.sql'
ssh aspace-vps 'docker exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < /tmp/abc-os-migrations/0001_init_schema.sql'
ssh aspace-vps 'docker exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < /tmp/abc-os-migrations/0002_rls_policies.sql'
# 0003 only on dev:
ssh aspace-vps "docker exec -i supabase-db psql -U postgres -d postgres -v ON_ERROR_STOP=1 -v app.env=dev < /tmp/abc-os-migrations/0003_seed_umoja.sql"
```

### Path C — Local Supabase CLI (dev iteration, not for prod)

```bash
cd apps/abc-os-community
npx supabase db push --db-url postgresql://postgres:postgres@localhost:54322/postgres
```

## HITL gates (per `05_supabase/AGENTS.md` W4 + ADR-SUPABASE-001 D7)

Before each of these, A0 must explicitly GO:

1. **Migrations 0000-0002** (DCL + DDL on the prod DB) = create schema, grant aspace_admin, create 7 tables, enable RLS, 30 policies, JWT helpers. **STOP**, A0 confirms.
2. **`PGRST_DB_SCHEMAS` edit** (add `abc_os` to the list) + `supabase-rest` container restart. **STOP**, A0 confirms.
3. **Migration 0003** = INSERT into `auth.users` on the prod DB. **NEVER on prod** — only on dev schema or local.

## Verification (post-apply, all paths)

```sql
-- 1. Schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'abc_os';
-- expect: 1 row

-- 2. 7 tables
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'abc_os' AND table_name != '_aspace_migrations';
-- expect: 7

-- 3. RLS enabled on all
SELECT count(*) FROM pg_tables WHERE schemaname = 'abc_os' AND rowsecurity = true;
-- expect: 7

-- 4. Policies count (4 per table × 7 tables = 28, plus memberships has 4 = 28, plus organizations has 2 = 30)
SELECT count(*) FROM pg_policies WHERE schemaname = 'abc_os';
-- expect: 30

-- 5. PostgREST exposure (after D8#2 fix)
curl -H "Accept-Profile: abc_os" https://supabase.kalybana.com/rest/v1/organizations?select=id,slug
-- expect: 200 OK with []
```

## See also

- `_SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md` D4 (table mapping) + D5 (RLS templates)
- `_SPECS/ADR/ADR-SUPABASE-001_self-hosted-multi-tenancy-schemas.md` D3 (bootstrap) + D4 (aspace_admin role)
- `10_Tech_OS/11_Infra_13th_Doctor/06_MCP_Mastery/05_supabase/AGENTS.md` W1-W5 (operational contract)
- `apps/abc-os-community/supabase/scripts/apply-abc-os-migrations.sh` — Path B apply script (Path B = canonical until supabase-aspace MCP lands)
