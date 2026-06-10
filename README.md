# ABC OS Community

Sovereignty-grade **cooperative business dashboard** for West/East African co-ops. Flagship surface of the **ABC OS & Child Care BOS** (L2 of A'Space OS V2).

The dashboard shows the 4-hub spine that frames every cooperative:

- **Community** — discussions, events, member feed (`/community`)
- **Learn** — courses, modules, progress (`/learn`)
- **Build** — project milestones, team, tools (`/build-hub`)
- **Brand** — collective identity score (`/brand`)

A `/sandbox` route wraps the dashboard in a simulated iOS phone frame for demo recordings (gated to dev/preview only — see `AGENTS.md`).

Current mock data: *Umoja Weavers* cooperative in Nairobi (Amara Okonkwo, FR-primary).

## Stack

| Layer | Tech | Version |
|-------|------|---------|
| Framework | [Next.js](https://nextjs.org) (App Router, Turbopack) | 15.5.19 |
| UI | [React](https://react.dev) | 19.1 |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + `@tailwindcss/postcss` | ^4 |
| Types | TypeScript | ^5 |
| Lint | ESLint (`next/core-web-vitals` + typescript) | ^9 |

**Node engine**: `>=20.0.0` (enforced in `package.json`).

## Develop

```powershell
cd "C:\Users\amado\ASpace_OS_V2\30_Business_OS\10_Projects\abc\apps\abc-os-community"
npm install            # Node 20+ required
npm run dev            # next dev --turbopack  → http://localhost:3000
npm run build          # next build --turbopack
npm run start          # production server
npm run lint           # eslint
npx tsc --noEmit       # type check only
```

## Project layout

```
src/
├── app/
│   ├── page.tsx           # Dashboard root
│   ├── globals.css        # Tailwind 4 + design tokens
│   ├── layout.tsx
│   ├── community/         # /community
│   ├── learn/             # /learn
│   ├── build-hub/         # /build-hub  (Vercel reserves /build)
│   ├── brand/             # /brand
│   └── sandbox/           # /sandbox  (demo iOS frame; dev-only)
├── components/            # 8 components (HubCard, ActionCard, Spotlight, …)
├── data/mockData.ts       # HUB_CONFIG + INITIAL_DATA (single source of truth)
├── hooks/useLocalStorage.ts
└── types/index.ts         # Member · HubPulse · ActionItem · SpotlightProject · FeedItem · AppData
```

## Deploy

Hosted on **Vercel** in the `amd-lab` team.

- **Project ID**: `prj_HSw4IBR2omI5qegmEinOksr6xzo0`
- **Team ID**: `team_d3JjRK4fJUE9ACohbdlhv9Gc`
- **GitHub repo**: [Amdkn/02-ABC-OS](https://github.com/Amdkn/02-ABC-OS)
- **Default deploy path**: push to `main` → Vercel auto-builds (per `04_vercel/AGENTS.md`).
- **Reserved path gotcha**: Vercel owns `/build`, so this app exposes the Build hub at **`/build-hub`** (see `AGENTS.md`).

## Related apps in the project

- `abc-childcare-portal` — parallel mature fork, already deployed. Reference for the `next-intl` FR/EN pattern and the original `/build-hub` rename (commit `9ed1691`).
- `ABC OS Community-01/` — design source of truth (vanilla static prototype, Space Grotesk, iOS phone frame). The Next.js port must preserve visual parity (8.5/10 per the Picard audit).

## More context

- Active dev handoff: `00_Amadeus/30_MEMORY_CORE/LLM_Wiki/wiki/hand_offs/handoff_abc_os_community_dev_2026-06-10.md`
- Project root conventions: `../CLAUDE.md`
- Doctrine junction (immutable): `_doctrine/` → `20_Life_OS/24_PARA_Enterprise/01_Projects_Picard/02 ABC OS & Child Care BOS/`
- Vercel contract: `10_Tech_OS/11_Infra_13th_Doctor/06_MCP_Mastery/04_vercel/AGENTS.md`
