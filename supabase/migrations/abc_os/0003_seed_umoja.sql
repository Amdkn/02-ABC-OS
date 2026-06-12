-- Migration 0003: Seed Umoja Weavers (Phase 2 P2.1)
-- ADR: _SPECS/ADR/ADR-ABCOS-001_multitenant-supabase-strategy.md D4
-- Date: 2026-06-10 | Status: PROPOSED (DEV-ONLY — guarded by app_env check at apply time)
-- Source data: apps/abc-os-community/src/data/mockData.ts (Umoja Weavers)

-- ============================================================================
-- 0. SAFETY: this migration MUST NOT run on prod
-- ============================================================================
-- Apply path will check: SELECT current_setting('app.env', true) = 'dev'
-- If != 'dev', the migration is skipped (see scripts/apply-abc-os-migrations.sh).

-- ============================================================================
-- 1. Umoja Weavers organization
-- ============================================================================
INSERT INTO abc_os.organizations (id, slug, name, place) VALUES
  ('11111111-1111-1111-1111-111111111111', 'umoja-weavers', 'Umoja Weavers', 'Nairobi')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. Seed users in auth.users (DEV-ONLY — uses fixed UUIDs for reproducibility)
-- ============================================================================
-- WARNING: real auth signup must go through Supabase Auth. This is for local dev only.
INSERT INTO auth.users (id, email, raw_user_meta_data, instance_id, aud, role, created_at, updated_at, email_confirmed_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'amara@umojaw.example', '{"name":"Amara"}'::jsonb, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', now(), now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'kofi@umojaw.example',  '{"name":"Kofi"}'::jsonb,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. Memberships (Amara = owner, Kofi = member)
-- ============================================================================
INSERT INTO abc_os.memberships (user_id, org_id, role) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'member')
ON CONFLICT (user_id, org_id) DO NOTHING;

-- ============================================================================
-- 4. Members (dashboard card data)
-- ============================================================================
INSERT INTO abc_os.members (id, org_id, user_id, name, full_name, initials, tint) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Amara Okonkwo', 'Amara Okonkwo · Nairobi', 'AO', '#C9A77C'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Kofi Mensah',  'Kofi Mensah · Accra',    'KM', '#7BA38F')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. Hub pulse (initial payload)
-- ============================================================================
INSERT INTO abc_os.hub_pulse (org_id, hub, payload) VALUES
  ('11111111-1111-1111-1111-111111111111', 'community', '{"members":12,"threads":4,"events":2}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'learn',     '{"courses":6,"inProgress":3,"completed":2}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'build',     '{"projects":3,"milestone":2,"milestoneTotal":5}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'brand',     '{"score":85,"delta":4,"top":"Soko Weavers"}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. Action items
-- ============================================================================
INSERT INTO abc_os.action_items (org_id, hub, title, description, due_at, urgent, assignee_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'community', 'Préparer l''assemblée mensuelle', 'Ordre du jour + invitations', now() + interval '3 days', true,  'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('11111111-1111-1111-1111-111111111111', 'learn',     'Finaliser module teintures', 'Relecture par 2 pairs',     now() + interval '7 days', false, 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('11111111-1111-1111-1111-111111111111', 'build',     'Livrer milestone séchoir', 'Photos avant/après requises', now() + interval '2 days', true,  'cccccccc-cccc-cccc-cccc-cccccccccccc'),
  ('11111111-1111-1111-1111-111111111111', 'brand',     'Publier étude de cas Soko', 'Coordination avec graphiste', now() + interval '10 days', false, 'dddddddd-dddd-dddd-dddd-dddddddddddd');

-- ============================================================================
-- 7. Spotlight projects
-- ============================================================================
INSERT INTO abc_os.spotlight_projects (id, org_id, name, tag, description, place, ms, ms_total, pct, team) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Solaris Agri-Coop', 'Énergie', 'Coopérative solaire pour les exploitations familiales', 'Mali', 3, 5, 60, '[{"name":"Awa","tint":"#7BA38F"},{"name":"Samba","tint":"#C9A77C"}]'::jsonb),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Umoja Weavers',     'Artisanat', 'Tissage traditionnel kényan modernisé', 'Nairobi', 1, 8, 12, '[{"name":"Amara","tint":"#C9A77C"},{"name":"Kofi","tint":"#7BA38F"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. Feed items
-- ============================================================================
INSERT INTO abc_os.feed_items (org_id, who, av, hub, what, detail, when_at, place) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Amara',     '{"initials":"AO","tint":"#C9A77C"}'::jsonb, 'community', 'a lancé un fil dans Communauté',  'Assemblée mensuelle — ordre du jour ouvert', now() - interval '2 hours', 'Nairobi'),
  ('11111111-1111-1111-1111-111111111111', 'Kofi',      '{"initials":"KM","tint":"#7BA38F"}'::jsonb, 'learn',     'a terminé un module de Learn',     'Teintures naturelles · 6/6 leçons',        now() - interval '5 hours', 'Accra'),
  ('11111111-1111-1111-1111-111111111111', 'Sahel Solar', '{"initials":"SS","tint":"#D4A155"}'::jsonb, 'build',   'a posté un milestone dans Build',  'Séchoir solaire v2 — prototype livré',      now() - interval '1 day',   'Bamako'),
  ('11111111-1111-1111-1111-111111111111', 'Brand Bot',  '{"initials":"BB","tint":"#9C7BD0"}'::jsonb, 'brand',    'a publié un score de marque',       'Soko Weavers passe à 85/100',                now() - interval '2 days',  null);

-- ============================================================================
-- 9. MIGRATIONS TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0003_seed_umoja.sql')
  ON CONFLICT (filename) DO NOTHING;
