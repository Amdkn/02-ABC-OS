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
