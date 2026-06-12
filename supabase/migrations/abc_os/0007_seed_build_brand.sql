-- Migration 0007: Seed Build Hub (5 milestones) + Brand Hub (4 brand_scores snapshots)
-- Source: apps/abc-os-community/src/data/mockData.ts (Umoja Weavers + Solaris Agri-Coop)
-- Idempotent: ON CONFLICT DO NOTHING
-- Umoja Weavers org_id: 11111111-1111-1111-1111-111111111111 (from 0003)

-- ============================================================================
-- 1. BUILD HUB: 5 milestones for Umoja Weavers
-- ============================================================================
INSERT INTO abc_os.build_milestones (id, org_id, name, description, status, due_date, completed_at, sort_order) VALUES
  ('umw-ms-constitution',  '11111111-1111-1111-1111-111111111111',
    'Constitution juridique de la coopérative',
    'Enregistrement officiel, statuts, règlement intérieur et assemblée constituante signés par les 12 membres fondateurs.',
    'completed',  '2025-09-15', '2025-09-12 00:00:00+00', 1),

  ('umw-ms-atelier',       '11111111-1111-1111-1111-111111111111',
    'Premier atelier de tissage opérationnel',
    'Local équipé de 8 métiers à tisser traditionnels, sourcing de coton kényan certifié, formation des 6 tisseuses au nouveau protocole qualité.',
    'completed',  '2025-12-01', '2025-11-28 00:00:00+00', 2),

  ('umw-ms-certif',        '11111111-1111-1111-1111-111111111111',
    'Certification équitable (Fair Trade)',
    'Audit FLOCERT, mise en conformité de la chaîne de production, prime de développement pour les tisserandes.',
    'in_progress','2026-08-30', null, 3),

  ('umw-ms-export',        '11111111-1111-1111-1111-111111111111',
    'Première vente internationale',
    'Contrat de distribution avec une boutique équitable à Paris (5 000 unités), logistique export Nairobi → Marseille, douane UE.',
    'pending',    '2026-11-15', null, 4),

  ('umw-ms-expansion',     '11111111-1111-1111-1111-111111111111',
    'Expansion régionale (Mombasa + Kisumu)',
    'Ouverture de 2 antennes commerciales sur la côte et dans l''ouest, recrutement local de 8 tisseuses supplémentaires.',
    'blocked',    '2027-03-31', null, 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. BRAND HUB: 4 historical score snapshots for Umoja Weavers (time-series)
-- ============================================================================
-- Last 30 days, +6 points net, +3 since the most recent snapshot.
-- Chartable via SELECT score, delta, recorded_at ORDER BY recorded_at.
--
-- Idempotency: recorded_at is HARDCODED (not `now() - interval`) so re-runs
-- produce identical timestamps. Combined with the UNIQUE (org_id, recorded_at)
-- constraint added in 0005, the ON CONFLICT DO NOTHING is a true no-op on
-- re-apply. Tradeoff: dates are frozen to 2026-06-11 (seed authoring date)
-- rather than "rolling 30 days from now" — acceptable for a dev seed.
INSERT INTO abc_os.brand_scores (org_id, score, delta, notes, recorded_at, created_by) VALUES
  ('11111111-1111-1111-1111-111111111111', 76,  0, 'Baseline post-certification FLOCERT (audit initial, promesse de marque publiée).',  '2026-05-12 00:00:00+00'::timestamptz, null),
  ('11111111-1111-1111-1111-111111111111', 78, +2, 'Première étude de cas Instagram virale (12k likes), 80 nouveaux followers en 48h.',         '2026-05-28 00:00:00+00'::timestamptz, null),
  ('11111111-1111-1111-1111-111111111111', 80, +2, 'Article blog "Slow Fashion Africa" mentionne Umoja comme modèle.',                            '2026-06-04 00:00:00+00'::timestamptz, null),
  ('11111111-1111-1111-1111-111111111111', 82, +2, 'Demande entrante boutique équitable Paris (contrat export signé en attente).',                  '2026-06-11 00:00:00+00'::timestamptz, null)
ON CONFLICT (org_id, recorded_at) DO NOTHING;

-- ============================================================================
-- 3. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0007_seed_build_brand.sql')
  ON CONFLICT (filename) DO NOTHING;
