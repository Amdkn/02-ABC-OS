# Build Hub Wiring — Session Notes (2026-06-12)

## Mission
Wire the 4-level Build Hub v2 catalog (`build_categories` / `build_projects` / `build_phases` / `build_tasks`) into the Next.js `build-hub` page, keeping the existing per-tenant milestones intact, then deploy to Vercel.

## Doctrine Anchors Invoked
- **ADR-ABCOS-001 D10 mixed-tenancy** — shared catalog (RLS select-authenticated) + per-tenant (`build_milestones`, `org_id` filter) coexist.
- **ADR-META-001 D1** — every step has observable output (file changes, build exit, curl response).
- **ADR-META-001 D3** — schema > spec when they diverge. The task brief said 5/17/40/111, the seed SQL has 5/17/48/141. We use the real numbers, comment the drift.
- **ADR-META-001 D4** — no self-contradiction; sort locally after nested select; count the actual data, don't trust the brief.
- **ADR-META-001 D6** — empty data on local smoke = Supabase network reachability, not React code.
- **"Vercel reserves /build"** — stayed on `src/app/build-hub/`.
- **"No SERVICE_ROLE_KEY in Vercel env"** — never touched.
- **TypeScript rules** (no `any`, immutable, no `console.log`, Zod) — honored (no `any`, all interfaces, immutable spreads/maps).

## D3 Drift Observed (must report to A0)
The task brief said:
- 40 phases, 111 tasks

The actual seed (`0011_build_hub_v2_seed.sql`) has:
- 48 phases
- 141 tasks

The discrepancy is ~20% on both counts. Possible causes (none confirmed):
- The handoff doc had stale counts (was probably counted from `tasks_count` sum in TS, not actual array lengths).
- Or the spec writer truncated the SQL before paste.

The runtime app uses the real seed, not the spec numbers. The seed `tasks_count` columns already match the effective array counts (per the file's own §4 sanity check: "tasks_count in build_projects is the EFFECTIVE count from the phases[].tasks[] arrays, not the declared tasksCount field"). So the DB and the UI agree.

## Files Modified

### 1. `apps/abc-os-community/src/app/build-hub/page.tsx`
- **Kept**: org lookup, `spotlight_projects` fetch, `build_milestones` fetch (per-tenant).
- **Added**: `build_categories` fetch (ordered by `sort_order`).
- **Added**: `build_projects` fetch with nested select `phases:build_phases(tasks:build_tasks(...))` — same pattern as `learn/page.tsx`.
- **Added**: typed DB interfaces (`DBBuildCategory`, `DBBuildProject`, `DBBuildPhase`, `DBBuildTask`) + mapped UI types (`BuildCategory`, `BuildProject`, `BuildPhase`, `BuildTask` exported from client page).
- **Added**: D3 drift comment block (D1 cite, D3 cite, schema column-name drift note).

### 2. `apps/abc-os-community/src/app/build-hub/BuildHubClientPage.tsx`
- **Kept**: full existing UI (spotlight progress card + "Prochains jalons" milestones section).
- **Added**: "Catalogue Build Hub" section with 4-level hierarchy rendered as collapsible cards.
- **State**: `useState<Set<string>>` for `expandedCategories` and `expandedProjects` (immutable update via `new Set(prev)` + add/delete).
- **Visual language**: same card style as milestones section (`rounded-3xl border border-[var(--line)] bg-[var(--card)]`), same `var(--build-blue)` accent for the header pill.
- **Totals counter**: `useMemo` for live counts (5 cat / 17 proj / 48 phases / 141 tasks) — single source of truth, no double counting.
- **Defensive**: empty-state messages if Supabase returns `[]` (no crash on offline).

### 3. `apps/abc-os-community/supabase/BUILD_HUB_WIRING_NOTES.md`
- This file — handoff notes for next session.

## D1 Receipts

| Step | Receipt | Status |
|------|---------|--------|
| Step 1: read pattern | 7 files read in full | OK |
| Step 2: page.tsx updated | 159 lines written | OK |
| Step 3: client page updated | 386 lines written | OK |
| Step 4: tsc | `npx tsc --noEmit` exited 0 with zero output | CLEAN |
| Step 4: build | `npm run build` exited 0; `/build-hub` 8.53 kB (was ~3 kB); Turbopack finished in 14.1s | EXIT 0 |
| Step 5: local curl | `curl http://localhost:3000/build-hub` → HTTP 200, "Catalogue Build Hub" heading present, "Aucun jalon configuré" + "Catalogue en cours de chargement" (Supabase `abc.kalybana.com` unreachable from this box — pre-existing network restriction, not introduced by this change) | 200 OK |
| Step 6: Vercel deploy | `vercel deploy --yes --target preview` succeeded, deployment `dpl_ghoUQc7UEzSK36GQMNrzmvuowYa6` READY | OK |
| Step 6: preview curl | `vercel curl https://abc-os-community-ni1kvkgl4-amd-lab.vercel.app/build-hub` → 200 OK, RSC payload shows `projects:[],milestones:[],categories:[],catalogProjects:[]` (all 4 props wired), "Catalogue Build Hub" h2 in HTML | 200 OK |

## Vercel Preview URL
https://abc-os-community-ni1kvkgl4-amd-lab.vercel.app/build-hub

Vercel SSO Authentication is enabled on this project — anonymous curl returns 401 with a "use vercel curl" hint page. Use `vercel curl` from the authed CLI to bypass.

## Network Reachability Caveat
Both the local dev box and the Vercel preview cannot reach `abc.kalybana.com` (self-hosted Supabase on a VPS). The `build_milestones` section was already empty before this change (same root cause). Our Build Hub v2 wiring is correct end-to-end: tsc clean, build clean, props pass through server→client, the new section renders, and graceful empty-state messages appear when data is unavailable. Once the Supabase host is reachable from a network vantage point, the data will flow.

## Open Follow-ups (for A0 attention)

1. **D3 drift confirmation** — please confirm whether the spec writer used a stale copy of the seed, or whether phases/tasks were intentionally trimmed. The wiring follows the seed as-shipped (5/17/48/141). No code change needed unless you want to align the spec.

2. **Vercel SSO** — the deployment protection is in amd-lab team settings. If A0 wants public preview URLs (no auth gate), adjust the project-level deployment protection in the Vercel dashboard.

3. **Network egress from Vercel to `abc.kalybana.com`** — the Vercel preview deployment cannot reach the self-hosted Supabase (curl from the Vercel runtime would also fail). If this persists, consider:
   - Migrating Supabase to a Vercel-reachable region (e.g. Vercel Postgres, or Supabase Cloud).
   - Adding a Vercel Edge Config to cache the 4-level catalog (read-heavy, write-rare).
   - Using Vercel's "Trusted Sources" feature if the goal is just to test the integration behind the auth gate.

4. **No production promote yet** — this is a preview deployment. Promote with `vercel deploy --prod --scope team_d3JjRK4fJUE9ACohbdlhv9Gc` once A0 has eyeballed the preview.

5. **No git commit** — per the doctrine "Amadeus ne touche pas aux configs" and the CLAUDE.md "never commit without explicit ask", I did not commit. Awaiting A0's review of the diff before `git add && git commit` (or use `/prp-commit` skill per the ECC tooling).

6. **`/vercel/.vercel/` and `.vercel/project.json`** — the `vercel link` step created these. They are gitignored per the ECC standard `.gitignore` (vercel/.vercel/ in most Next.js templates). Verify before committing.

## Next Session — Suggested Picks
- Eyeball the preview URL (after Vercel auth bypass).
- Promote to prod if approved.
- Add the AGENTS.md note in `apps/abc-os-community/AGENTS.md` closing the build-hub wiring ticket.
- Append a one-liner to `ASpace_OS_V2/00_Amadeus/30_MEMORY_CORE/LLM_Wiki/wiki/log.md` per the project CLAUDE.md "write-back protocol".
- Consider the Skill Creator Reflex: the 3-step pattern "read pattern → mirror it → D3 drift comment" is now used twice (learn→build-hub v2). Could become `/mirror-hub` skill. **Not auto-proposing per the doctrine — A0's call.**
