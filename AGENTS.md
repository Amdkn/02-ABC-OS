<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ABC OS Community — App Agent Guide

Sovereignty-grade cooperative business dashboard for West/East African co-ops (mock: *Umoja Weavers* in Nairobi, FR-primary). 4-hub spine: **Community** · **Learn** · **Build** (routed as `/build-hub` — Vercel reserves `/build`) · **Brand**. Mobile-first Bento layout with a `/sandbox` iOS-shell preview.

## Work Guidance

- **Pick up the dev handoff** at `00_Amadeus/30_MEMORY_CORE/LLM_Wiki/wiki/hand_offs/handoff_abc_os_community_dev_2026-06-10.md` — it lists the 7 open tickets, the Vercel project ID `prj_HSw4IBR2omI5qegmEinOksr6xzo0` (team `team_d3JjRK4fJUE9ACohbdlhv9Gc`), and the deploy workflow.
- **Mock data is the single source of truth**: `src/data/mockData.ts` (HUB_CONFIG + INITIAL_DATA, types in `src/types/index.ts`). To swap to a real backend, replace the import in `page.tsx` and the 4 hub pages only.
- **Commands** (from `apps/abc-os-community/`): `npm install` (Node 20+ enforced), `npm run dev` (Turbopack), `npm run build`, `npm run lint`. After any route rename or src change, verify with `npx tsc --noEmit` then `npm run build`.

## Recent Work (2026-06-13)

- **3 UX/perf bugs fixed locally** + 1 A0 HITL pending (Vercel env var). See wiki/log.md 2026-06-13 entry for full D1 receipts.
- **Material Symbols self-hosted** via `@material-symbols/font-400@^0.45.1` (npm). Google Fonts `<link>` removed from `layout.tsx`. Use `.material-symbols-outlined` class (unchanged from `globals.css` l.81-97).
- **Theme system rewritten** — new `src/contexts/ThemeContext.tsx` exports `ThemeProvider` + `useTheme()`. Cookie name `theme`, localStorage key `theme`, values `'light'|'dark'`. Default = light. SSR-safe via `cookies()` from `next/headers` in `layout.tsx`.
- **Theme toggles**: `HubLayout.tsx` sidebar (between spacer + member card) + mobile bottom nav 5th item. `DashboardClientPage.tsx` Preview Settings dock theme button REMOVED; dashboard has its own local sidebar/nav where toggles were also added (technical debt — see follow-up #8 in `project_abc_os_kalybana_fix_2026_06_13.md`).
- **Open ticket (A0 action pending)**: Vercel env var `NEXT_PUBLIC_SUPABASE_URL` must be updated from current `https://abc.kalybana.com` (NXDOMAIN, BUG) to `https://supabase.kalybana.com` (canonical, VPS 148.230.92.235). 3 scopes: Production, Preview, Development. Without this fix, every page render takes 14s due to RSC fetch timeout. Script ready: `scripts/apply-vercel-env.ps1`.
