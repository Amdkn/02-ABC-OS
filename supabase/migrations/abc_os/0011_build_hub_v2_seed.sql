-- Migration 0011: Build Hub v2 seed (5 categories + 17 projects + 40 phases + 111 tasks)
-- Source of truth: apps/abc-os-community/src/data/buildData.ts (handoff Antigravity §2)
-- Idempotent: ON CONFLICT (id) DO NOTHING on every INSERT
-- Date: 2026-06-12
--
-- ============================================================================
-- SANITY TOTALS (D4 no self-contradiction)
-- ============================================================================
-- 5 categories
-- 17 projects (4 homesteading + 2 architecture + 1 offgrid + 6 micro_revenue + 4 agentic_build)
-- 40 phases  (3+3+2+2 + 3+2 + 4 + 3+2+2+2+2+2 + 2+2+2+2 = 40)
-- 111 tasks  (12+9+4+6 + 10+4 + 12 + 7+6+6+5+5+4 + 6+6+5+4 = 111)
-- tasks_count in build_projects is the EFFECTIVE count from the TS array, not the declared tasksCount field
--   (e.g. zone-planning-1acre: declared 18 in TS, effective 12 in array — DB takes 12)
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIES (5 rows)
-- ============================================================================
INSERT INTO abc_os.build_categories (id, title, "desc", icon, accent, sort_order) VALUES
  ('homesteading',  'Homestead Souverain',    'Aménager ½ à 2 acres en système alimentaire autosuffisant. Zone planning, élevage multifonction, permaculture.', 'yard',             'var(--build-green)', 0),
  ('architecture',  'Architecture Africaine', 'Concevoir des bâtiments pour 100 ans — compound africain, matériaux locaux, bioclimatique.',                'home_work',        'var(--brand-gold)',  1),
  ('offgrid',       'Systèmes Off-Grid',      'Intégrer eau, énergie, alimentation en boucle fermée. Zéro déchet = chaque sortie est une entrée.',            'offline_bolt',     'var(--primary)',      2),
  ('micro_revenue', 'Micro-Revenue Engines',  'Petites machines physiques ou stands qui génèrent des revenus récurrents locaux sans employés.',                'storefront',       'var(--community)',    3),
  ('agentic_build', 'Agentic Build Systems',  'Automatiser la documentation, le contenu et les workflows de construction avec Claude Code.',                  'smart_toy',        'var(--build-blue)',   4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. PROJECTS (17 rows)
-- tasks_count = EFFECTIVE count from phases[].tasks[] arrays, not TS declared field
-- ============================================================================
INSERT INTO abc_os.build_projects (id, category_id, title, sub, "desc", progress, icon, accent, tasks_count, duration, sort_order) VALUES
  -- homesteading (4)
  ('zone-planning-1acre',       'homesteading',  'Zone Planning 1 Acre',                       'Homestead Souverain',    'Diviser 1 acre en 5 zones de permaculture (accès quotidien → annuel). Production alimentaire 12 mois/an.',                                              0, 'yard',     'var(--build-green)', 12, '3 mois',    0),
  ('amish-livestock-stack',     'homesteading',  'Élevage Multifonction ½ Acre',               'Homestead Souverain',    'Stack functions — poules (œufs+engrais), lapins (viande+peau), chèvres (lait+tonte). ≥3 fonctions par animal.',                                          0, 'pets',     'var(--build-green)',  9, '4 mois',    1),
  ('companion-planting-system', 'homesteading',  'Système de Plantes Compagnes',               'Homestead Souverain',    'Éliminer 100% des pesticides avec 20 associations stratégiques. Zéro intrant chimique.',                                                                  0, 'eco',      'var(--build-green)',  4, '2 mois',    2),
  ('backyard-revenue-5k',       'homesteading',  'Backyard Revenue — 5K$/Mois',                'Homestead Souverain',    'Transformer l''arrière-cour en source de revenu invisible depuis la rue. Modèle Garden That Lasts.',                                                          0, 'payments', 'var(--build-green)',  6, '6 mois',    3),
  -- architecture (2)
  ('african-compound-design',   'architecture',  'Compound Africain — Blueprint 100 Ans',     'Architecture Africaine', 'Concevoir une habitation compound (cour centrale + pièces périphériques) transmissible sur 3 générations. Matériaux locaux, orientation bioclimatique.', 0, 'home_work',       'var(--brand-gold)', 10, '8 mois',    4),
  ('tradition-modernite-arch',  'architecture',  'Dialectique Tradition/Modernité',           'Architecture Africaine', 'Réappropriation des architectures vernaculaires africaines face aux importations coloniales. Souveraineté culturelle par le bâti.',                       0, 'account_balance', 'var(--brand-gold)',  4, '2 mois',    5),
  -- offgrid (1)
  ('complete-offgrid-system',   'offgrid',       'Système Off-Grid Intégré',                   'Systèmes Off-Grid',      'Intégrer eau de pluie → filtration → irrigation → compost → sol → culture en une boucle fermée. Zéro perte.',                                                0, 'offline_bolt',     'var(--primary)',     12, '9 mois',    6),
  -- micro_revenue (6)
  ('driveway-stand-1k',         'micro_revenue', 'Driveway Stand — 1K$/Semaine',               'Micro-Revenue Engines',  'Modèle ACRE GAINS : vente directe depuis l''allée. Produits Amish (conserves, miel, légumes, artisanat). Revenue récurrent sans plateforme.',           0, 'storefront',       'var(--community)',   7, '2 mois',    7),
  ('china-machines-business',   'micro_revenue', '5 Machines Chinoises — Revenue Passif',     'Micro-Revenue Engines',  'Sélectionner et opérer 5 petites machines (presse à huile, moulin, découpeuse laser) qui génèrent ≥2K$/mois chacune.',                                0, 'precision_manufacturing', 'var(--community)', 6, '4 mois', 8),
  ('buy-business-not-start',    'micro_revenue', 'Acheter un Business — Codie Sanchez Framework','Micro-Revenue Engines','Acquérir un business ennuyeux déjà profitable plutôt que de créer from scratch. Framework de Codie Sanchez + Yomi Denzel.',                         0, 'business_center',  'var(--community)',   6, '3 mois',    9),
  ('wood-machines-artisan',     'micro_revenue', '6 Machines Bois Artisanales',                'Micro-Revenue Engines',  'Machines industrielles bois à petit budget (Promach Solutions). Fabrication de meubles, palettes, structures légères pour le marché local.',         0, 'hardware',         'var(--community)',   5, '2 mois',   10),
  ('expatriation-business-6',   'micro_revenue', '6 Métiers en Ligne pour s''Expatrier',       'Micro-Revenue Engines',  'Mariyah Liya framework — 6 activités digitales sans diplôme ni expérience préalable pour générer revenus depuis n''importe quel pays.',             0, 'language',         'var(--community)',   5, '2 mois',   11),
  ('acquisition-japon',         'micro_revenue', 'Acquisition d''Entreprise à l''International','Micro-Revenue Engines', 'Oussama Ammar — Racheter une PME étrangère sous-évaluée et la redresser. Cas pratique Japon.',                                                              0, 'flight',           'var(--community)',   4, '4 mois',   12),
  -- agentic_build (4)
  ('claude-content-machine',    'agentic_build', 'Claude Code — Machine à Contenu Illimité',  'Agentic Build Systems',  'Pipeline Thibault Didier — Générer des idées de contenu en illimité avec Claude Code. Architecture de prompts en couches. Idempotence des livrables.', 0, 'smart_toy',        'var(--build-blue)',  6, '3 semaines',13),
  ('api-monetization-2026',     'agentic_build', 'Monétiser des APIs — Guide 2026',            'Agentic Build Systems',  'Olly Rosewell framework — Construire un micro-SaaS basé sur une API niche. Stack minimaliste, documentation comme moat, revenue B2B récurrent.',    0, 'api',              'var(--build-blue)',  6, '6 semaines',14),
  ('youtube-claude-77k',        'agentic_build', 'Claude Code + YouTube — 77K$/Mois',         'Agentic Build Systems',  'Zaptwala framework — Combiner Claude Code Free Plan et YouTube pour générer revenus sans investissement initial.',                                          0, 'play_circle',      'var(--build-blue)',  5, '3 mois',   15),
  ('mini-business-2026',        'agentic_build', '7 Mini-Business qui vont Exploser en 2026', 'Agentic Build Systems',  'Louis Key framework — Identifier et lancer les 7 micro-businesses à plus fort potentiel en 2026. 340€/jour objectif.',                                0, 'trending_up',      'var(--build-blue)',  4, '6 semaines',16)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. PHASES (48 rows)
-- ============================================================================
INSERT INTO abc_os.build_phases (id, project_id, title, sort_order) VALUES
  -- zone-planning-1acre (3)
  ('zone-p1', 'zone-planning-1acre', 'Analyse du terrain',     0),
  ('zone-p2', 'zone-planning-1acre', 'Design des zones',        1),
  ('zone-p3', 'zone-planning-1acre', 'Mise en œuvre',          2),
  -- amish-livestock-stack (3)
  ('live-p1', 'amish-livestock-stack', 'Sélection des animaux', 0),
  ('live-p2', 'amish-livestock-stack', 'Infrastructure',         1),
  ('live-p3', 'amish-livestock-stack', 'Système intégré',        2),
  -- companion-planting-system (2)
  ('cp-p1', 'companion-planting-system', 'Design des associations', 0),
  ('cp-p2', 'companion-planting-system', 'Mise en place',           1),
  -- backyard-revenue-5k (2)
  ('bk-p1', 'backyard-revenue-5k', 'Sélection des productions à haute valeur', 0),
  ('bk-p2', 'backyard-revenue-5k', 'Infrastructure & Vente',                   1),
  -- african-compound-design (3)
  ('ac-p1', 'african-compound-design', 'Étude contextuelle',  0),
  ('ac-p2', 'african-compound-design', 'Design souverain',    1),
  ('ac-p3', 'african-compound-design', 'Construction Phase 1', 2),
  -- tradition-modernite-arch (2)
  ('tm-p1', 'tradition-modernite-arch', 'Recherche',   0),
  ('tm-p2', 'tradition-modernite-arch', 'Application', 1),
  -- complete-offgrid-system (4)
  ('og-p1', 'complete-offgrid-system', 'Eau — Collecte & Filtration',       0),
  ('og-p2', 'complete-offgrid-system', 'Énergie — Solaire Thermique + PV',   1),
  ('og-p3', 'complete-offgrid-system', 'Alimentation — Stockage sans Électricité', 2),
  ('og-p4', 'complete-offgrid-system', 'Intégration des flux',              3),
  -- driveway-stand-1k (3)
  ('ds-p1', 'driveway-stand-1k', 'Sélection des produits', 0),
  ('ds-p2', 'driveway-stand-1k', 'Installation du stand',   1),
  ('ds-p3', 'driveway-stand-1k', 'Opérations',                2),
  -- china-machines-business (2)
  ('cm-p1', 'china-machines-business', 'Sélection et sourcing', 0),
  ('cm-p2', 'china-machines-business', 'Setup et opérations',    1),
  -- buy-business-not-start (2)
  ('bb-p1', 'buy-business-not-start', 'Identification', 0),
  ('bb-p2', 'buy-business-not-start', 'Acquisition',     1),
  -- wood-machines-artisan (2)
  ('wm-p1', 'wood-machines-artisan', 'Équipement', 0),
  ('wm-p2', 'wood-machines-artisan', 'Marché',     1),
  -- expatriation-business-6 (2)
  ('ex-p1', 'expatriation-business-6', 'Sélection du métier', 0),
  ('ex-p2', 'expatriation-business-6', 'Lancement',            1),
  -- acquisition-japon (2)
  ('aj-p1', 'acquisition-japon', 'Sourcing international', 0),
  ('aj-p2', 'acquisition-japon', 'Acquisition',            1),
  -- claude-content-machine (2)
  ('cc-p1', 'claude-content-machine', 'Architecture du pipeline', 0),
  ('cc-p2', 'claude-content-machine', 'Automatisation',            1),
  -- api-monetization-2026 (2)
  ('api-p1', 'api-monetization-2026', 'Identification de la niche', 0),
  ('api-p2', 'api-monetization-2026', 'Construction',                1),
  -- youtube-claude-77k (2)
  ('yt-p1', 'youtube-claude-77k', 'Pipeline de contenu', 0),
  ('yt-p2', 'youtube-claude-77k', 'Monétisation',         1),
  -- mini-business-2026 (2)
  ('mb-p1', 'mini-business-2026', 'Sélection',  0),
  ('mb-p2', 'mini-business-2026', 'Lancement',  1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. TASKS (141 rows)
-- Phase IDs and task IDs are unique across the entire catalog (no collisions detected)
-- ============================================================================
INSERT INTO abc_os.build_tasks (id, phase_id, title, duration, sort_order) VALUES
  -- zone-planning-1acre > zone-p1 (3)
  ('z1',  'zone-p1', 'Relevé topographique et orientation solaire',     '1 sem', 0),
  ('z2',  'zone-p1', 'Test du sol (pH, drainage, nutriments)',          '1 sem', 1),
  ('z3',  'zone-p1', 'Cartographie des micro-climats',                  '1 sem', 2),
  -- zone-planning-1acre > zone-p2 (5)
  ('z4',  'zone-p2', 'Zone 1 — Potager annuel (10% surface)',          '2 sem', 0),
  ('z5',  'zone-p2', 'Zone 2 — Verger et arbustes fruitiers',          '2 sem', 1),
  ('z6',  'zone-p2', 'Zone 3 — Élevage (poules, lapins)',              '1 sem', 2),
  ('z7',  'zone-p2', 'Zone 4 — Forêt-jardin (noix, champignons)',      '2 sem', 3),
  ('z8',  'zone-p2', 'Zone 5 — Stockage eau et biomasse',               '1 sem', 4),
  -- zone-planning-1acre > zone-p3 (4)
  ('z9',  'zone-p3', 'Implantation des chemins et accès',              '1 sem', 0),
  ('z10', 'zone-p3', 'Installation compostage en boucle fermée',       '2 sem', 1),
  ('z11', 'zone-p3', 'Premier semis Zone 1',                           '2 sem', 2),
  ('z12', 'zone-p3', 'Calendrier saisonnier de production',            '1 sem', 3),
  -- amish-livestock-stack > live-p1 (3)
  ('l1',  'live-p1', 'Audit des 7 animaux multifonctions Amish',       '1 sem', 0),
  ('l2',  'live-p1', 'Sélection selon surface disponible',             '1 sem', 1),
  ('l3',  'live-p1', 'Plan de rotation des pâturages',                  '1 sem', 2),
  -- amish-livestock-stack > live-p2 (3)
  ('l4',  'live-p2', 'Construction poulailler (matériaux locaux)',      '2 sem', 0),
  ('l5',  'live-p2', 'Enclos lapins avec système fumier-compost',       '2 sem', 1),
  ('l6',  'live-p2', 'Abri chèvres bioclimatique',                     '2 sem', 2),
  -- amish-livestock-stack > live-p3 (3)
  ('l7',  'live-p3', 'Flux fumier → compost → jardin',                 '1 sem', 0),
  ('l8',  'live-p3', 'Calendrier abattage et conservation',            '1 sem', 1),
  ('l9',  'live-p3', 'Calcul nutritionnel famille/an',                 '1 sem', 2),
  -- companion-planting-system > cp-p1 (2)
  ('cp1', 'cp-p1', 'Cartographie des 20 plantes compagnes clés',       '1 sem', 0),
  ('cp2', 'cp-p1', 'Intégration dans le plan Zone 1',                  '1 sem', 1),
  -- companion-planting-system > cp-p2 (2)
  ('cp3', 'cp-p2', 'Semis stratifiés et calendrier',                   '2 sem', 0),
  ('cp4', 'cp-p2', 'Observations et ajustements saison 1',              '4 sem', 1),
  -- backyard-revenue-5k > bk-p1 (3)
  ('bk1', 'bk-p1', 'Audit des cultures premium (microgreens, champignons, herbes)', '1 sem', 0),
  ('bk2', 'bk-p1', 'Calcul du ROI par m²',                              '1 sem', 1),
  ('bk3', 'bk-p1', 'Choix des 3 productions principales',               '1 sem', 2),
  -- backyard-revenue-5k > bk-p2 (3)
  ('bk4', 'bk-p2', 'Mise en place serre ou espace protégé',            '3 sem', 0),
  ('bk5', 'bk-p2', 'Système de commandes locales (Telegram/WhatsApp)',  '1 sem', 1),
  ('bk6', 'bk-p2', 'Premier cycle de vente et ajustements',            '4 sem', 2),
  -- african-compound-design > ac-p1 (3)
  ('ac1', 'ac-p1', 'Analyse des architectures vernaculaires locales',  '2 sem', 0),
  ('ac2', 'ac-p1', 'Inventaire des matériaux locaux disponibles',      '1 sem', 1),
  ('ac3', 'ac-p1', 'Étude bioclimatique (ensoleillement, vents dominants)', '1 sem', 2),
  -- african-compound-design > ac-p2 (4)
  ('ac4', 'ac-p2', 'Plan masse du compound (cour centrale)',           '2 sem', 0),
  ('ac5', 'ac-p2', 'Design des pièces modulaires extensibles',         '3 sem', 1),
  ('ac6', 'ac-p2', 'Intégration éléments culturels africains',         '2 sem', 2),
  ('ac7', 'ac-p2', 'Calcul structurel pisé/bambou',                    '2 sem', 3),
  -- african-compound-design > ac-p3 (3)
  ('ac8', 'ac-p3', 'Fondations et plancher',                           '3 sem', 0),
  ('ac9', 'ac-p3', 'Murs en pisé ou adobe',                            '4 sem', 1),
  ('ac10','ac-p3', 'Toiture traditionnelle (chaume/tuile locale)',      '3 sem', 2),
  -- tradition-modernite-arch > tm-p1 (2)
  ('tm1', 'tm-p1', 'Documentation des typologies architecturales africaines', '2 sem', 0),
  ('tm2', 'tm-p1', 'Analyse des adaptations climatiques historiques',  '2 sem', 1),
  -- tradition-modernite-arch > tm-p2 (2)
  ('tm3', 'tm-p2', 'Guide de réinterprétation moderne',                '2 sem', 0),
  ('tm4', 'tm-p2', 'Moodboard et charte architecturale souveraine',    '2 sem', 1),
  -- complete-offgrid-system > og-p1 (4)
  ('og1', 'og-p1', 'Calcul surface de collecte (toiture)',             '1 sem', 0),
  ('og2', 'og-p1', 'Installation citerne enterrée',                    '3 sem', 1),
  ('og3', 'og-p1', 'Système filtration multi-étages',                  '2 sem', 2),
  ('og4', 'og-p1', 'Réseau de distribution gravitaire',                '2 sem', 3),
  -- complete-offgrid-system > og-p2 (3)
  ('og5', 'og-p2', 'Dimensionnement panneau solaire thermique',        '1 sem', 0),
  ('og6', 'og-p2', 'Installation chauffe-eau solaire',                  '2 sem', 1),
  ('og7', 'og-p2', 'PV + batterie pour éclairage et usages faibles',  '3 sem', 2),
  -- complete-offgrid-system > og-p3 (3)
  ('og8', 'og-p3', 'Cave de stockage (température constante)',         '2 sem', 0),
  ('og9', 'og-p3', 'Techniques de conservation (fermentation, séchage)','2 sem', 1),
  ('og10','og-p3', 'Frigo solaire passif',                             '2 sem', 2),
  -- complete-offgrid-system > og-p4 (2)
  ('og11','og-p4', 'Mapping complet sortie→entrée de chaque sous-système','1 sem', 0),
  ('og12','og-p4', 'Tableau de bord souverain (consommation/production)','2 sem', 1),
  -- driveway-stand-1k > ds-p1 (2)
  ('ds1', 'ds-p1', 'Audit des produits à marge élevée (conserves, miel, œufs)', '1 sem', 0),
  ('ds2', 'ds-p1', 'Calcul prix de revient et prix de vente',          '1 sem', 1),
  -- driveway-stand-1k > ds-p2 (3)
  ('ds3', 'ds-p2', 'Construction stand en bois (matériaux locaux)',    '2 sem', 0),
  ('ds4', 'ds-p2', 'Signalétique et branding artisanal',               '1 sem', 1),
  ('ds5', 'ds-p2', 'Système de paiement (honesty box ou mobile)',      '1 sem', 2),
  -- driveway-stand-1k > ds-p3 (2)
  ('ds6', 'ds-p3', 'Calendrier d''approvisionnement hebdomadaire',    '1 sem', 0),
  ('ds7', 'ds-p3', 'Optimisation gamme selon ventes',                  '4 sem', 1),
  -- china-machines-business > cm-p1 (3)
  ('cm1', 'cm-p1', 'Audit des 30 machines à forte opportunité (Garage Profits)', '2 sem', 0),
  ('cm2', 'cm-p1', 'Calcul ROI et seuil de rentabilité',               '1 sem', 1),
  ('cm3', 'cm-p1', 'Commande et réception des 5 machines',             '4 sem', 2),
  -- china-machines-business > cm-p2 (3)
  ('cm4', 'cm-p2', 'Installation et formation technique',              '2 sem', 0),
  ('cm5', 'cm-p2', 'Premiers clients et pricing',                      '2 sem', 1),
  ('cm6', 'cm-p2', 'Automatisation des commandes',                     '2 sem', 2),
  -- buy-business-not-start > bb-p1 (3)
  ('bb1', 'bb-p1', 'Liste des 7 business ennuyeux ultra-rentables',   '1 sem', 0),
  ('bb2', 'bb-p1', 'Critères de sélection (cash-flow, secteur local, opérateur possible)', '1 sem', 1),
  ('bb3', 'bb-p1', 'Sourcing des opportunités locales',                '2 sem', 2),
  -- buy-business-not-start > bb-p2 (3)
  ('bb4', 'bb-p2', 'Due diligence financière',                         '2 sem', 0),
  ('bb5', 'bb-p2', 'Négociation et structuration juridique',           '2 sem', 1),
  ('bb6', 'bb-p2', 'Transition et formation',                          '2 sem', 2),
  -- wood-machines-artisan > wm-p1 (2)
  ('wm1', 'wm-p1', 'Sélection des 6 machines bois rentables',          '1 sem', 0),
  ('wm2', 'wm-p1', 'Atelier d''installation et sécurité',              '2 sem', 1),
  -- wood-machines-artisan > wm-p2 (3)
  ('wm3', 'wm-p2', 'Gamme produits bois à forte demande locale',       '2 sem', 0),
  ('wm4', 'wm-p2', 'Système de commandes et livraisons',               '1 sem', 1),
  ('wm5', 'wm-p2', 'Formation d''un apprenti',                         '2 sem', 2),
  -- expatriation-business-6 > ex-p1 (2)
  ('ex1', 'ex-p1', 'Audit des 6 métiers vs compétences actuelles',     '1 sem', 0),
  ('ex2', 'ex-p1', 'Validation marché cible',                          '1 sem', 1),
  -- expatriation-business-6 > ex-p2 (3)
  ('ex3', 'ex-p2', 'Portfolio et premiers clients',                    '3 sem', 0),
  ('ex4', 'ex-p2', 'Système de facturation international',             '1 sem', 1),
  ('ex5', 'ex-p2', 'Automatisation des livrables',                     '2 sem', 2),
  -- acquisition-japon > aj-p1 (2)
  ('aj1', 'aj-p1', 'Identifier les marchés à forte décote (Japon, Europe de l''Est)', '2 sem', 0),
  ('aj2', 'aj-p1', 'Réseaux de courtiers locaux',                      '2 sem', 1),
  -- acquisition-japon > aj-p2 (2)
  ('aj3', 'aj-p2', 'Structure légale internationale',                  '3 sem', 0),
  ('aj4', 'aj-p2', 'Intégration et redressement',                      '4 sem', 1),
  -- claude-content-machine > cc-p1 (3)
  ('cc1', 'cc-p1', 'Définir les catégories de contenu cibles',         '2j',  0),
  ('cc2', 'cc-p1', 'Design des prompts en couches (brief → draft → polish)', '3j',  1),
  ('cc3', 'cc-p1', 'Workflow Claude Code idempotent',                  '3j',  2),
  -- claude-content-machine > cc-p2 (3)
  ('cc4', 'cc-p2', 'Script de génération batch (50 idées/run)',        '3j',  0),
  ('cc5', 'cc-p2', 'Système de validation et filtrage qualité',        '2j',  1),
  ('cc6', 'cc-p2', 'Export automatique vers Notion/Obsidian',          '2j',  2),
  -- api-monetization-2026 > api-p1 (3)
  ('api1','api-p1', 'Audit des APIs à forte valeur (données rares)',   '1 sem', 0),
  ('api2','api-p1', 'Validation marché B2B',                            '1 sem', 1),
  ('api3','api-p1', 'Calcul du pricing et modèle de revenue',          '3j',  2),
  -- api-monetization-2026 > api-p2 (3)
  ('api4','api-p2', 'Stack minimaliste (1 dev + API + Stripe)',        '1 sem', 0),
  ('api5','api-p2', 'Documentation publique (le moat)',                '1 sem', 1),
  ('api6','api-p2', 'Premiers clients et feedback loop',               '1 sem', 2),
  -- youtube-claude-77k > yt-p1 (3)
  ('yt1', 'yt-p1', 'Architecture Claude Code → Script → YouTube',     '1 sem', 0),
  ('yt2', 'yt-p1', 'Niche et positionnement canal',                    '1 sem', 1),
  ('yt3', 'yt-p1', 'Workflow de production automatisé',                '2 sem', 2),
  -- youtube-claude-77k > yt-p2 (2)
  ('yt4', 'yt-p2', 'Stratégie AdSense + produits digitaux',            '2 sem', 0),
  ('yt5', 'yt-p2', 'Scaling avec agents Claude Code',                  '2 sem', 1),
  -- mini-business-2026 > mb-p1 (2)
  ('mb1', 'mb-p1', 'Audit des 7 opportunités 2026',                    '1 sem', 0),
  ('mb2', 'mb-p1', 'Test de marché rapide (48h)',                      '1 sem', 1),
  -- mini-business-2026 > mb-p2 (2)
  ('mb3', 'mb-p2', 'MVP et premiers revenus',                          '2 sem', 0),
  ('mb4', 'mb-p2', 'Automatisation et scaling',                        '2 sem', 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0011_build_hub_v2_seed.sql')
  ON CONFLICT (filename) DO NOTHING;
