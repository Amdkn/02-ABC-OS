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

## Recent Work (2026-06-14)

### Tour 3 — 20 bug fixes via 11 sub-agents + Playwright MCP + Q/A tests
- **3 commits pushed** : `9115e11` (20 bug fixes), `13050b7` (redeploy trigger), `d30b68f` (mobile nav pb-40 + safe-area)
- **TTFB<1s warm** (tour 2 baseline) preserved : `/community` 0.48s warm, `/build-hub` 4.5s cold → 0.x warm
- **i18n EN default** : `src/types/index.ts` ActionItem/FeedItem/SpotlightProject refactored to `kind`/`data` discriminated-union + `src/data/mockData.ts` migrated + 3 card components (ActionCard/FeedCard/Spotlight) rewritten with `useTranslations('dashboard.*')` + HubCard + page.tsx + messages/en.json updated
- **A11y** : `aria-label` on 6 Synced buttons + 2 'next best actions pending' + `role="img"` on SvgGauge
- **Mobile bottom nav** : `grid-cols-4`, no dark mode, no FAB, fixed `z-50`, `pb-40` mobile + `pb-32` desktop + `env(safe-area-inset-bottom)` for iOS notches
- **Quick action** : `bolt` → `flash_on`, onClick + scroll target `dashboard-today-section`, `cursor-pointer`
- **Home button** : brandmark Link wrap on Dashboard (`<Link href="/">` aria-label="dashboard")
- **Preview Settings dock** : removed from Dashboard
- **Synced dev stub** : removed `setAppState` toggle, display-only "Synced · just now" with `aria-label="Synchronization status: OK"`
- **useAuth wire** : DashboardClientPage derives `member` from `useAuth().user` with `data.member` fallback
- **Q/A tests** : `tests/e2e/{hubs,chaos}.spec.ts` + `playwright.config.ts` (mobile-chrome Pixel 5 + desktop-chrome projects), 12/12 tests PASS
- **Playwright MCP** : `~/.mcp.json` extended with `playwright` server (npx @playwright/mcp@latest) — plugin `playwright@claude-plugins-official` is BROKEN (manifest only, no code in cache, 45 stale locks), bypassed via direct MCP server config

### Vercel CDN stale — A0 observationnal bug
- A0 reported "member card missing on /build-hub sidebar" + "mobile bottom nav not persistent on /build-hub" at 3:05 AM 2026-06-14
- D1 verified source code: both bugs are FALSE POSITIVES — code is correct
- D1 verified prod HTML via curl + browser MCP: Vercel CDN was serving stale build (pre-`9115e11`)
- After commit `d30b68f` push + 30s sleep: prod shows correct content (`Umoja Weavers`, `Next best actions`, no `Finaliser le milestone`, no `5 nouvelles`)
- Fix2 added D2 surgical fix: HubLayout.tsx l.116 `pb-40 md:pb-32` + inline `paddingBottom: 'max(160px, calc(80px + env(safe-area-inset-bottom)))'` + l.181 `z-50` (was z-[6]) + `bg-[var(--card)]/95` (was /90)

### Open follow-ups
- `+` button in each page (Learn/Build/Brand) per A0 redirect — pending
- Dashboard `App.tsx` l.93 "Admin User" hardcode → useAuth() integration (Phase C Auth)
- Supabase VPS perf (Kong/PostgREST slow query) — /brand cold ~6s, /build-hub cold ~4.5s
- Dashboard duplicate mobile nav (DashboardClientPage.tsx l.335-362) — technical debt
- Test Key Pragma phase 4: A0 rotate VERCEL_TOKEN + ANON_KEY post-tour-3

### Reference resource
- Shubham SHARMA "J'en avais marre de tester mon app à la main" (CLARIFIED_PLANE, video ID `OfrZE35gHM0`) at `C:/Users/amado/ASpace_OS_V2/20_Life_OS/24_PARA_Enterprise/03_Resources_Geordi/01_Guides/01_Business/resource_j39en_avais_marre_de_tester_mon_app_à_la_main_alor.md` — applied via tests/e2e/chaos.spec.ts (Prompt de Destruction: empty submit, rapid toggle, invalid email, rapid nav, mobile overflow)
