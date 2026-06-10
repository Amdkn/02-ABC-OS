# scripts/ — operational helpers for abc-os-community

This folder is the home for short, single-purpose operational scripts that
the Vercel / Supabase contracts need. Keep scripts here focused and small
(< 100 lines, one job each). The doctrine lives deep in
`10_Tech_OS/11_Infra_13th_Doctor/06_MCP_Mastery/`; this folder is the
thin execution surface that points at it.

## apply-vercel-env.ps1

**Purpose.** Apply a single env var to the abc-os-community Vercel project
across all 3 scopes (`development`, `preview`, `production`) — the
`update_env_variable x 3 + list_env_variables` re-verify pattern from
`04_vercel/AGENTS.md` W2.

**When to use.** P1.4 of ADR-ABCOS-001 — wiring `NEXT_PUBLIC_SUPABASE_URL`
and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel. Future env-var additions
follow the same script.

### Pre-flight (Test Key Pragma)

Real anon keys **never** live in `.md`, `.json`, or any git-tracked file.
The Test Key Pragma flow is:

1. **A0 pastes the key in chat** with explicit intent ("teste ca" or
   "applique la cle anon a Vercel").
2. **Agent sets it in env User Windows** (so it survives across calls
   inside the session but is not committed):
   ```powershell
   [Environment]::SetEnvironmentVariable(
       'ASPACE_SUPABASE_ANON_KEY',
       '<paste-here>',
       'User'
   )
   $env:ASPACE_SUPABASE_ANON_KEY = [Environment]::GetEnvironmentVariable(
       'ASPACE_SUPABASE_ANON_KEY', 'User'
   )
   ```
3. **Agent runs the script** (see invocations below) → script validates,
   does the HITL gate, emits a JSON payload for the MCP calls, writes
   `.last-apply.json` (no value, just metadata).
4. **Agent drives the MCP calls** (script emits the structured payload;
   the agent runs `mcp__vercel__update_env_variable` x 3 in parallel and
   re-verifies with `mcp__vercel__list_env_variables`).
5. **A0 rotates the key** in the Supabase dashboard after confirmation.
6. **Optional re-paste** for a clean rotation, or update the User env var
   directly without re-paste.

### Invocations

**URL (public, no HITL needed beyond script default):**

```powershell
pwsh -NoProfile ./scripts/apply-vercel-env.ps1 `
    -Key NEXT_PUBLIC_SUPABASE_URL `
    -Value 'https://supabase.kalybana.com'
```

**Anon key (sourced from env User Windows):**

```powershell
pwsh -NoProfile ./scripts/apply-vercel-env.ps1 `
    -Key NEXT_PUBLIC_SUPABASE_ANON_KEY `
    -Value $env:ASPACE_SUPABASE_ANON_KEY
```

**CI / looped (skip prod HITL — only if A0 has signed off on the loop):**

```powershell
pwsh -NoProfile ./scripts/apply-vercel-env.ps1 `
    -Key NEXT_PUBLIC_SUPABASE_URL `
    -Value 'https://supabase.kalybana.com' `
    -SkipProdConfirm
```

### Hard guards baked into the script

- **Forbidden key patterns** (case-insensitive): `*SECRET*`, `*SERVICE_ROLE*`,
  `*PASSWORD*`. The script exits 1 with an explanatory error if the key
  matches. This is the permanent guard rail against accidentally wiring
  `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
- **HITL for production** (default ON): the script `Read-Host`-confirms
  before any prod write. Bypass with `-SkipProdConfirm` only in trusted
  CI loops.
- **No value in any commit artifact**: the JSON sidecar
  (`.last-apply.json`) records `ValueLength` only, never the value.

### Verification (D1 / ADR-META-001)

After the agent runs the 3 parallel MCP calls, it must prove the wire with:

```text
mcp__vercel__list_env_variables(projectId: 'prj_HSw4IBR2omI5qegmEinOksr6xzo0')
```

Expectation: the key appears with `target: ['development', 'preview',
'production']` and a non-null value. If any target is missing, the agent
re-runs the missing scope and re-verifies (Vercel sometimes silently
drops the `target` array on PATCH).

## Domain note

- Vercel alias already exists: `abc-os-community.vercel.app` (default
  Vercel preview URL for the project).
- Custom domain **`abc.kalybana.com`** to be added later. Wiring path
  when ready:
  1. DNS via `01_hostinger/AGENTS.md` (CNAME or A/ALIAS to
     `cname.vercel-dns.com`).
  2. Vercel domain assignment via `mcp__vercel__add_project_domain`.
  3. SSL provisioning is automatic; verify with
     `mcp__vercel__get_project_domain`.

This is tracked in the project-level CLAUDE.md "Open tickets" section,
not in this README (doctrine lives deep, scripts stay short).

## Files in this folder

| File | Role |
|------|------|
| `apply-vercel-env.ps1` | The 3-scope env-var writer (P1.4). |
| `README.md` | This file. |
| `.last-apply.json` | Sidecar audit trail (key + value length + scopes + timestamp). Regenerated on every run. |
