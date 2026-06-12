#!/usr/bin/env bash
# =============================================================================
# apply-abc-os-migrations.sh — Run abc_os migrations on aspace-vps Supabase
# =============================================================================
# ADR: _SPECS/ADR/ADR-SUPABASE-001_self-hosted-multi-tenancy-schemas.md D3+D4
#      _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md D4+D5
# Date: 2026-06-10
# Status: PROPOSED — not yet invoked. Requires A0 explicit "GO" per HITL gate
#          (see README.md §"HITL gates").
#
# Usage (from local dev machine, with SSH alias `aspace-vps` configured):
#   ./scripts/apply-abc-os-migrations.sh [dev|prod]
#
# What it does:
#   1. Copies 4 .sql files to /tmp/abc-os-migrations/ on aspace-vps
#   2. Runs each via `docker exec -i supabase-db psql` with -v ON_ERROR_STOP=1
#   3. Verifies post-conditions (schema, tables, RLS, policies)
#   4. Refuses to run if `app.env` != requested target (safety)
#
# What it does NOT do (manual HITL-gated steps required before running):
#   - Edit /opt/supabase/.env (PGRST_DB_SCHEMAS)
#   - Restart supabase-rest container
#   - These are OUTSIDE the script — see README §"HITL gates"
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
TARGET="${1:-dev}"  # default to dev to be safe
VPS_ALIAS="aspace-vps"
CONTAINER="supabase-db"
REMOTE_TMP="/tmp/abc-os-migrations"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../migrations/abc_os" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# -----------------------------------------------------------------------------
# Pre-flight
# -----------------------------------------------------------------------------
echo -e "${YELLOW}==> Pre-flight checks${NC}"

if [[ "$TARGET" != "dev" && "$TARGET" != "prod" ]]; then
  echo -e "${RED}ERROR: TARGET must be 'dev' or 'prod' (got: $TARGET)${NC}"
  exit 1
fi

for f in 0000_grants_aspace_admin.sql 0001_init_schema.sql 0002_rls_policies.sql 0003_seed_umoja.sql 0004_learn_hub_schema.sql 0005_build_brand_hub_schema.sql 0006_seed_learn_hub.sql 0007_seed_build_brand.sql 0008_rls_learn_build_brand.sql 0010_build_hub_v2_schema.sql 0011_build_hub_v2_seed.sql 0012_rls_build_hub_v2.sql; do
  if [[ ! -f "$LOCAL_DIR/$f" ]]; then
    echo -e "${RED}ERROR: missing local migration file: $LOCAL_DIR/$f${NC}"
    exit 1
  fi
done

# Verify SSH alias works
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$VPS_ALIAS" true 2>/dev/null; then
  echo -e "${RED}ERROR: cannot reach $VPS_ALIAS via SSH (alias configured?)${NC}"
  exit 1
fi

# Confirm app.env on the VPS — if it's prod and TARGET=dev, abort; if dev
# and TARGET=prod, abort. The dev-only seed (0003) is the real safety net.
ACTUAL_ENV=$(ssh "$VPS_ALIAS" "docker exec -i $CONTAINER psql -U postgres -d postgres -tAc \"SELECT current_setting('app.env', true)\"" 2>/dev/null | tr -d '[:space:]')
echo "  app.env on VPS = '$ACTUAL_ENV' (TARGET = '$TARGET')"

# If we need a different env for the apply (e.g. running dev seeds against a
# prod-labeled container), we can pass it via PGOPTIONS. The preflight itself
# runs against the actual setting — if you see "mismatch" below, run the
# script with FORCE_TARGET=1 to override (logged).
if [[ "$ACTUAL_ENV" != "$TARGET" ]]; then
  if [[ "${FORCE_TARGET:-0}" == "1" ]]; then
    echo -e "${YELLOW}  FORCE_TARGET=1: proceeding with PGOPTIONS=-c app.env=$TARGET (actual=$ACTUAL_ENV)${NC}"
  else
    echo -e "${RED}ERROR: app.env mismatch. Refusing to run $TARGET migrations on $ACTUAL_ENV.${NC}"
    echo "  Hint: pass FORCE_TARGET=1 to override (will use PGOPTIONS=-c app.env=$TARGET)."
    exit 1
  fi
fi

if [[ "$TARGET" == "prod" ]]; then
  echo -e "${RED}============================================================${NC}"
  echo -e "${RED}  PROD APPLY: this writes to the production database.${NC}"
  echo -e "${RED}  Migrations 0000-0002 only. 0003 (seed) is DEV-ONLY.${NC}"
  echo -e "${RED}============================================================${NC}"
  read -p "Type 'GO-PROD' to continue: " CONFIRM
  if [[ "$CONFIRM" != "GO-PROD" ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# -----------------------------------------------------------------------------
# Copy
# -----------------------------------------------------------------------------
echo -e "${YELLOW}==> Copying migrations to $VPS_ALIAS:$REMOTE_TMP${NC}"
ssh "$VPS_ALIAS" "rm -rf $REMOTE_TMP && mkdir -p $REMOTE_TMP"
scp "$LOCAL_DIR"/*.sql "$VPS_ALIAS:$REMOTE_TMP/"

# -----------------------------------------------------------------------------
# Apply (in order)
# -----------------------------------------------------------------------------
apply_sql() {
  local file="$1"
  local extra_flags="${2:-}"
  local pgopts=""
  echo -e "${YELLOW}==> Applying $file${NC}"
  # If FORCE_TARGET was set, pass app.env via PGOPTIONS for every apply call.
  if [[ "${FORCE_TARGET:-0}" == "1" ]]; then
    pgopts="env PGOPTIONS='-c app.env=$TARGET'"
  fi
  if [[ -n "$extra_flags" ]]; then
    ssh "$VPS_ALIAS" "docker exec -i $CONTAINER $pgopts psql -U postgres -d postgres -v ON_ERROR_STOP=1 $extra_flags < $REMOTE_TMP/$file"
  else
    ssh "$VPS_ALIAS" "docker exec -i $CONTAINER $pgopts psql -U postgres -d postgres -v ON_ERROR_STOP=1 < $REMOTE_TMP/$file"
  fi
}

apply_sql 0000_grants_aspace_admin.sql
apply_sql 0001_init_schema.sql
apply_sql 0002_rls_policies.sql

if [[ "$TARGET" == "dev" ]]; then
  apply_sql 0003_seed_umoja.sql
  apply_sql 0004_learn_hub_schema.sql
  apply_sql 0005_build_brand_hub_schema.sql
  apply_sql 0006_seed_learn_hub.sql
  apply_sql 0007_seed_build_brand.sql
  apply_sql 0008_rls_learn_build_brand.sql
  apply_sql 0010_build_hub_v2_schema.sql
  apply_sql 0011_build_hub_v2_seed.sql
  apply_sql 0012_rls_build_hub_v2.sql
else
  echo -e "${YELLOW}==> Skipping dev-only migrations (0003-0007, 0008, 0011)${NC}"
fi

if [[ "$TARGET" == "prod" ]]; then
  # 0004-0005 are schema (per-tenant where applicable), safe for prod IF business
  # wants the 4-hub model. Seed files (0006-0007, 0011) are NOT applied in prod.
  apply_sql 0004_learn_hub_schema.sql
  apply_sql 0005_build_brand_hub_schema.sql
  # 0008 RLS is required in prod for security (D1 doctrine). Catalog reads
  # are universal; per-tenant policies enforce org_id isolation.
  apply_sql 0008_rls_learn_build_brand.sql
  # 0010 = 4 shared-catalog build_hub_v2 tables (D10 mixed-tenancy, no org_id)
  # 0012 = RLS for the 4 new tables (universal read for authenticated)
  apply_sql 0010_build_hub_v2_schema.sql
  apply_sql 0012_rls_build_hub_v2.sql
fi

# -----------------------------------------------------------------------------
# Verify
# -----------------------------------------------------------------------------
echo -e "${YELLOW}==> Verifying post-conditions${NC}"
VERIFY_SQL="
SELECT 'schema_exists'   AS check, count(*)::text AS result FROM information_schema.schemata WHERE schema_name = 'abc_os'
UNION ALL SELECT 'tables_count',        count(*)::text FROM information_schema.tables WHERE table_schema = 'abc_os' AND table_name != '_aspace_migrations'
UNION ALL SELECT 'rls_enabled',         count(*)::text FROM pg_tables WHERE schemaname = 'abc_os' AND rowsecurity = true
UNION ALL SELECT 'policies_count',      count(*)::text FROM pg_policies WHERE schemaname = 'abc_os'
UNION ALL SELECT 'migrations_logged',   count(*)::text FROM abc_os._aspace_migrations;
"

ssh "$VPS_ALIAS" "docker exec -i $CONTAINER psql -U postgres -d postgres -tAc \"$VERIFY_SQL\""

# Expected: schema_exists=1, tables_count=17 (7 core + 4 learn + 2 build_brand + 4 build_hub_v2), rls_enabled=17, policies_count=42 (38 + 4 new), migrations_logged=12 (dev) or 7 (prod: 0000-0002 + 0004-0005 + 0008 + 0010 + 0012)
# If you see different numbers, something is wrong — read README §"Verification"

echo -e "${GREEN}==> Apply complete. Run the 5 verification queries from README.md to confirm.${NC}"
echo "    Local:  see apps/abc-os-community/supabase/migrations/README.md"
echo "    Remote: ssh $VPS_ALIAS 'docker exec -i $CONTAINER psql -U postgres -d postgres -c \"<query>\"'"
