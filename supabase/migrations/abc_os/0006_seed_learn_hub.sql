-- Migration 0006: Seed Learn Hub (5 categories, 30 courses, 60 modules, 132 chapters)
-- Source: apps/abc-os-community/src/data/learnData.ts
-- Idempotent: ON CONFLICT DO NOTHING everywhere
-- Counters: 5 cat | 30 courses (6/cat) | 60 modules (2/course avg) | 132 chapters

-- ============================================================================
-- 1. CATEGORIES (5)
-- ============================================================================
INSERT INTO abc_os.learn_categories (id, title, "desc", icon, accent, sort_order) VALUES
  ('structuration', 'Business Structuration', 'Bâtir des coopératives et systèmes pérennes et transmissibles.', 'layers', 'var(--learn-green)', 1),
  ('agentic',       'Architecture Agentique',  'Co-piloter avec des swarms de collaborateurs synthétiques.', 'construction', 'var(--brand-gold)', 2),
  ('autodidact',    'Apprentissage Autodidacte', 'Méthodologies d''assimilation accélérée de compétences.', 'school', 'var(--primary)', 3),
  ('productivity',  'Personal Productivity',   'Optimiser son énergie, son temps et son organisation au quotidien.', 'schedule', 'var(--build-blue)', 4),
  ('solarpunk',     'Solarpunk Civilisation',  'Concevoir des futurs durables, circulaires et low-tech.', 'eco', 'var(--community)', 5)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. COURSES (30 — 6 per category)
-- ============================================================================
INSERT INTO abc_os.learn_courses (id, category_id, title, sub, "desc", progress, icon, accent, lessons_count, duration, sort_order) VALUES
  -- structuration (6)
  ('emyth',              'structuration', 'E-Myth Revisited',         'Business Structuration', 'Arrêter de travailler DANS sa coopérative pour travailler SUR sa coopérative. Structurer les rôles clés.', 60, 'layers',              'var(--learn-green)', 12, '3h 15m', 1),
  ('built-to-sell',      'structuration', 'Built to Sell',             'Business Structuration', 'Comment créer une entreprise transmissible et indépendante de son fondateur en standardisant son offre.', 0,  'bookmark',            'var(--learn-green)', 8,  '2h 10m', 2),
  ('who-not-how',        'structuration', 'Who Not How',               'Business Structuration', 'Apprendre à déléguer l''exécution à des experts humains ou à des agents synthétiques.', 0,  'groups',              'var(--learn-green)', 10, '2h 30m', 3),
  ('million-dollar-weekend', 'structuration', 'Million Dollar Weekend', 'Business Structuration', 'Validation ultra-rapide des idées de business en 48 heures sans dépenser de budget.', 0,  'calendar_today',      'var(--learn-green)', 8,  '1h 55m', 4),
  ('offers',             'structuration', '$100M Offers',              'Business Structuration', 'Créer des offres irrésistibles qui maximisent la valeur perçue et détruisent la concurrence.', 20, 'workspace_premium',  'var(--learn-green)', 14, '3h 40m', 5),
  ('brand-club',         'structuration', 'Billion Dollar Brand Club', 'Business Structuration', 'Concevoir des marques Direct-to-Consumer (DTC) fortes en maîtrisant sa relation client et sa logistique.', 0, 'campaign', 'var(--learn-green)', 9, '2h 15m', 6),

  -- agentic (6)
  ('claude-code',        'agentic', 'Claude Code agnostique',  'Architecture Agentique', 'Maîtriser Claude Code CLI pour l''ingénierie rapide de fichiers, la modification agile de code et le debug.', 35, 'construction',     'var(--brand-gold)', 8,  '2h 05m', 1),
  ('codex-cli',          'agentic', 'Codex CLI & Résilience',   'Architecture Agentique', 'Mettre en place Codex CLI (MiniMax-M3) avec alias codexm, configuration $env:CODEX_HOME et bypass d''approbations.', 0, 'tune',            'var(--brand-gold)', 7,  '1h 45m', 2),
  ('gemini-sdk',         'agentic', 'Gemini SDK & Large Contexte', 'Architecture Agentique', 'Développer des intégrations avec Gemini 1.5 pour le traitement de fenêtres de contextes à 2M de tokens.', 0, 'bolt', 'var(--brand-gold)', 9, '2h 20m', 3),
  ('openclaw',           'agentic', 'Openclaw Framework',       'Architecture Agentique', 'Mettre en place une architecture d''agents et monitorer leur activité via le tableau de bord Openclaw.', 10, 'trending_up',      'var(--brand-gold)', 11, '2h 50m', 4),
  ('hermes-agents',      'agentic', 'Hermes Agents & Inférence Locale', 'Architecture Agentique', 'Déployer des modèles souverains fine-tunés en local ou sur VPS pour s''affranchir des services cloud fermés.', 0, 'account_balance', 'var(--brand-gold)', 8, '2h 10m', 5),
  ('minimax-tokens',     'agentic', 'Minimax Token Plan',       'Architecture Agentique', 'Planification budgétaire de la consommation d''API, routage intelligent de prompts et limitation de coûts.', 0, 'analytics',     'var(--brand-gold)', 6,  '1h 30m', 6),

  -- autodidact (6)
  ('learning-how-to-learn', 'autodidact', 'Learning How to Learn',     'Apprentissage Autodidacte', 'Exploiter les modes concentrés et diffus, les techniques Pomodoro et contrer la procrastination.', 45, 'book',             'var(--primary)', 10, '2h 15m', 1),
  ('uncommon-sense',        'autodidact', 'Uncommon Sense Teaching',   'Apprentissage Autodidacte', 'Neurosciences appliquées à la transmission rapide de compétences et consolidation mnésique.', 0, 'school',           'var(--primary)', 8,  '2h 00m', 2),
  ('art-of-learning',       'autodidact', 'The Art of Learning',       'Apprentissage Autodidacte', 'Josh Waitzkin : Approche de la haute performance, perte pour gain, et ancrage d''états de flux.', 0, 'workspace_premium', 'var(--primary)', 12, '3h 10m', 3),
  ('first-20-hours',        'autodidact', 'The First 20 Hours',        'Apprentissage Autodidacte', 'Déconstruire une compétence pour apprendre le minimum requis en 20 heures de pratique ciblée.', 0, 'calendar_today',   'var(--primary)', 7,  '1h 40m', 4),
  ('ultralearning',         'autodidact', 'Ultralearning',             'Apprentissage Autodidacte', 'Scott Young : Apprentissage intensif auto-dirigé, immersion, métacognition et suppression de friction.', 0, 'search',        'var(--primary)', 9,  '2h 25m', 5),
  ('master-guides',         'autodidact', 'Master Guides',             'Apprentissage Autodidacte', 'Ingestion rapide et distillation de connaissances massives sous standard Geordi Premium.', 15, 'edit',         'var(--primary)', 8,  '2h 00m', 6),

  -- productivity (6)
  ('ikigai',         'productivity', 'Ikigai',                 'Personal Productivity', 'Trouver sa raison d''être et aligner passion, mission, vocation et profession au quotidien.', 50, 'favorite',        'var(--build-blue)', 8,  '1h 50m', 1),
  ('lifewheel',      'productivity', 'Life Wheel',             'Personal Productivity', 'Évaluer et équilibrer régulièrement les 8 dimensions de vie pour une efficacité saine et sans épuisement.', 0, 'change_history', 'var(--build-blue)', 6, '1h 25m', 2),
  ('12wy',           'productivity', '12 Weeks Year',          'Personal Productivity', 'Condenser ses objectifs annuels en sprints de 12 semaines pour forcer l''action et le focus.', 0, 'hourglass_empty', 'var(--build-blue)', 10, '2h 45m', 3),
  ('secondbrain',    'productivity', 'Second Brain PARA',      'Personal Productivity', 'Organiser et stocker efficacement ses notes et documents avec la méthodologie de Tiago Forte.', 10, 'cloud_queue',    'var(--build-blue)', 9,  '2h 10m', 4),
  ('gtd',            'productivity', 'Getting Things Done',    'Personal Productivity', 'La méthode incontournable de David Allen pour libérer sa charge mentale et structurer ses tâches.', 0, 'task_alt',       'var(--build-blue)', 11, '3h 05m', 5),
  ('4h-workweek',    'productivity', '4H Workweek D.E.A.L',    'Personal Productivity', 'Définir de nouvelles règles du jeu, éliminer le superflu, automatiser ses revenus et se libérer.', 0, 'explore',        'var(--build-blue)', 8,  '2h 20m', 6),

  -- solarpunk (6)
  ('biomimetisme',     'solarpunk', 'Biomimétisme',          'Solarpunk Civilisation', 'S''inspirer des modèles et stratégies de la nature pour concevoir des technologies et systèmes résilients.', 0, 'park',           'var(--community)', 8,  '2h 15m', 1),
  ('circular-economy', 'solarpunk', 'Circular Economy',      'Solarpunk Civilisation', 'Repenser nos cycles industriels pour éliminer le concept même de déchet (fondation Ellen MacArthur).', 15, 'sync',            'var(--community)', 9,  '2h 30m', 2),
  ('blue-economy',     'solarpunk', 'Blue Economy',          'Solarpunk Civilisation', 'Créer de la valeur locale en s''appuyant sur les ressources disponibles à la manière des écosystèmes.', 0, 'water',         'var(--community)', 7,  '1h 55m', 3),
  ('low-tech',         'solarpunk', 'Low Tech',              'Solarpunk Civilisation', 'Développer des technologies utiles, durables, réparables et localement appropriables.', 0, 'handyman',         'var(--community)', 8,  '2h 10m', 4),
  ('urban-acupuncture', 'solarpunk', 'Urban Acupuncture',     'Solarpunk Civilisation', 'Jaime Lerner : Revitaliser l''écosystème urbain via des impulsions et micro-interventions ciblées.', 0, 'location_city',  'var(--community)', 6, '1h 35m', 5),
  ('age-connaissance', 'solarpunk', 'L''âge de la Connaissance', 'Solarpunk Civilisation', 'Idriss Aberkane : Comprendre l''économie de la connaissance (ressource infinie) pour concevoir l''avenir.', 0, 'psychology', 'var(--community)', 8, '2h 05m', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. MODULES (61 — 2-3 per course)
-- ============================================================================
INSERT INTO abc_os.learn_modules (id, course_id, title, sort_order) VALUES
  -- emyth (3)
  ('emyth-m1', 'emyth', 'M1: Le Mythe de l''Entrepreneur', 1),
  ('emyth-m2', 'emyth', 'M2: La Révolution de la Franchise Clé en Main', 2),
  ('emyth-m3', 'emyth', 'M3: L''Ingénierie des Rôles (Org Chart)', 3),
  -- built-to-sell (2)
  ('bts-m1',   'built-to-sell', 'M1: Le Service Produit (Productized Service)', 1),
  ('bts-m2',   'built-to-sell', 'M2: Indépendance & Processus', 2),
  -- who-not-how (2)
  ('wnh-m1',   'who-not-how', 'M1: Penser en "Qui" au lieu de "Comment"', 1),
  ('wnh-m2',   'who-not-how', 'M2: Délégation Systémique', 2),
  -- million-dollar-weekend (2)
  ('mdw-m1',   'million-dollar-weekend', 'M1: Vaincre la Peur & Agir', 1),
  ('mdw-m2',   'million-dollar-weekend', 'M2: La Validation Instantanée', 2),
  -- offers (2)
  ('offers-m1','offers', 'M1: L''Équation de la Valeur', 1),
  ('offers-m2','offers', 'M2: Structurer l''Offre', 2),
  -- brand-club (2)
  ('bc-m1',    'brand-club', 'M1: La Révolution de la Marque Directe', 1),
  ('bc-m2',    'brand-club', 'M2: Maîtrise de la Logistique & Qualité', 2),

  -- claude-code (2)
  ('cc-m1',    'claude-code', 'M1: Prise en main du terminal agile', 1),
  ('cc-m2',    'claude-code', 'M2: Ingenerie & Refactoring', 2),
  -- codex-cli (2)
  ('codex-m1', 'codex-cli', 'M1: Configuration Souveraine', 1),
  ('codex-m2', 'codex-cli', 'M2: Sécurité et Bypass d''Approbations', 2),
  -- gemini-sdk (2)
  ('gem-m1',   'gemini-sdk', 'M1: RAG à Contexte Géant', 1),
  ('gem-m2',   'gemini-sdk', 'M2: Analyse Multimodale', 2),
  -- openclaw (2)
  ('oc-m1',    'openclaw', 'M1: Architecture Multi-Agents', 1),
  ('oc-m2',    'openclaw', 'M2: Monitoring & Mission Control', 2),
  -- hermes-agents (2)
  ('ha-m1',    'hermes-agents', 'M1: Servir un Modèle Localement', 1),
  ('ha-m2',    'hermes-agents', 'M2: Intégration dans le Workflow', 2),
  -- minimax-tokens (2)
  ('mm-m1',    'minimax-tokens', 'M1: Optimisation Financière', 1),
  ('mm-m2',    'minimax-tokens', 'M2: Limitation des Risques', 2),

  -- learning-how-to-learn (2)
  ('lhl-m1',   'learning-how-to-learn', 'M1: Focus & Diffusion', 1),
  ('lhl-m2',   'learning-how-to-learn', 'M2: Consolidation et Sommeil', 2),
  -- uncommon-sense (2)
  ('ust-m1',   'uncommon-sense', 'M1: Neurobiologie de l''Attention', 1),
  ('ust-m2',   'uncommon-sense', 'M2: Structuration de l''Onboarding', 2),
  -- art-of-learning (2)
  ('aol-m1',   'art-of-learning', 'M1: La Maîtrise des Fondamentaux', 1),
  ('aol-m2',   'art-of-learning', 'M2: Routine d''Ancrage du Flux', 2),
  -- first-20-hours (2)
  ('f20h-m1',  'first-20-hours', 'M1: Déconstruction & Simplification', 1),
  ('f20h-m2',  'first-20-hours', 'M2: Pratique Délibérée', 2),
  -- ultralearning (2)
  ('ul-m1',    'ultralearning', 'M1: Conception du Projet d''Étude', 1),
  ('ul-m2',    'ultralearning', 'M2: Feedback & Consolidation', 2),
  -- master-guides (2)
  ('mg-m1',    'master-guides', 'M1: Distillation Rapide', 1),
  ('mg-m2',    'master-guides', 'M2: Formalisation Geordi Guide', 2),

  -- ikigai (2)
  ('ik-m1',    'ikigai', 'M1: Les Quatre Cercles de l''Ikigai', 1),
  ('ik-m2',    'ikigai', 'M2: Alignement & Planification', 2),
  -- lifewheel (2)
  ('lw-m1',    'lifewheel', 'M1: Cartographie de la Roue de Vie', 1),
  ('lw-m2',    'lifewheel', 'M2: Plan de Rééquilibrage', 2),
  -- 12wy (2)
  ('12wy-m1',  '12wy', 'M1: Redéfinir son Horizon Temporel', 1),
  ('12wy-m2',  '12wy', 'M2: Planifier & Mesurer son Sprint', 2),
  -- secondbrain (2)
  ('sb-m1',    'secondbrain', 'M1: Capturer & Filtrer (CODE)', 1),
  ('sb-m2',    'secondbrain', 'M2: La Structure P.A.R.A.', 2),
  -- gtd (2)
  ('gtd-m1',   'gtd', 'M1: Les 5 Étapes du Flux de Travail', 1),
  ('gtd-m2',   'gtd', 'M2: Réflexion & Engagement', 2),
  -- 4h-workweek (2)
  ('4h-m1',    '4h-workweek', 'M1: Définir & Éliminer (D & E)', 1),
  ('4h-m2',    '4h-workweek', 'M2: Automatiser & Libérer (A & L)', 2),

  -- biomimetisme (2)
  ('bio-m1',   'biomimetisme', 'M1: Nature comme Modèle (Janine Benyus)', 1),
  ('bio-m2',   'biomimetisme', 'M2: Applications Pratiques', 2),
  -- circular-economy (2)
  ('ce-m1',    'circular-economy', 'M1: Éliminer les Déchets dès la Conception', 1),
  ('ce-m2',    'circular-economy', 'M2: Modèles d''Affaires Circulaires', 2),
  -- blue-economy (2)
  ('be-m1',    'blue-economy', 'M1: Les Principes de Gunter Pauli', 1),
  ('be-m2',    'blue-economy', 'M2: Innovations & Biomimétisme Économique', 2),
  -- low-tech (2)
  ('lt-m1',    'low-tech', 'M1: Utilité, Sobriété, Accessibilité', 1),
  ('lt-m2',    'low-tech', 'M2: Catalogue d''Innovations Low-Tech', 2),
  -- urban-acupuncture (2)
  ('ua-m1',    'urban-acupuncture', 'M1: La Ville comme Organisme Vivant', 1),
  ('ua-m2',    'urban-acupuncture', 'M2: Interventions Légères & Impact Majeur', 2),
  -- age-connaissance (2)
  ('ac-m1',    'age-connaissance', 'M1: Les Lois de la Connaissance', 1),
  ('ac-m2',    'age-connaissance', 'M2: Noopolitique et Souveraineté', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. CHAPTERS (132 — 2-3 per module)
-- ============================================================================
INSERT INTO abc_os.learn_chapters (id, module_id, title, duration, sort_order) VALUES
  -- emyth-m1 (3)
  ('emyth-m1-c1', 'emyth-m1', 'Ch. 1 : Le technicien devenu fou', '15m', 1),
  ('emyth-m1-c2', 'emyth-m1', 'Ch. 2 : Les trois personnalités : Technicien, Manager, Entrepreneur', '20m', 2),
  ('emyth-m1-c3', 'emyth-m1', 'Ch. 3 : L''enfance de l''entreprise', '15m', 3),
  -- emyth-m2 (2)
  ('emyth-m2-c1', 'emyth-m2', 'Ch. 4 : Le prototype de franchise', '20m', 1),
  ('emyth-m2-c2', 'emyth-m2', 'Ch. 5 : Penser son business comme un modèle duplicable', '25m', 2),
  -- emyth-m3 (3)
  ('emyth-m3-c1', 'emyth-m3', 'Ch. 6 : L''organigramme axé sur les fonctions, pas les personnes', '30m', 1),
  ('emyth-m3-c2', 'emyth-m3', 'Ch. 7 : Rédiger ses premières SOPs de référence', '25m', 2),
  ('emyth-m3-c3', 'emyth-m3', 'Ch. 8 : L''automatisation des flux de décision', '25m', 3),

  -- bts-m1 (2)
  ('bts-m1-c1', 'bts-m1', 'Ch. 1 : Identifier le produit le plus standardisable', '20m', 1),
  ('bts-m1-c2', 'bts-m1', 'Ch. 2 : Éliminer la dépendance aux sur-mesure', '15m', 2),
  -- bts-m2 (2)
  ('bts-m2-c1', 'bts-m2', 'Ch. 3 : Créer une équipe autonome', '25m', 1),
  ('bts-m2-c2', 'bts-m2', 'Ch. 4 : Structurer la facturation et le flux de trésorerie', '20m', 2),

  -- wnh-m1 (2)
  ('wnh-m1-c1', 'wnh-m1', 'Ch. 1 : La libération de temps par la collaboration', '20m', 1),
  ('wnh-m1-c2', 'wnh-m1', 'Ch. 2 : Évaluer sa valeur horaire réelle', '15m', 2),
  -- wnh-m2 (2)
  ('wnh-m2-c1', 'wnh-m2', 'Ch. 3 : Rôles complémentaires et alignement', '25m', 1),
  ('wnh-m2-c2', 'wnh-m2', 'Ch. 4 : Handoffs clairs et critères d''acceptation', '25m', 2),

  -- mdw-m1 (2)
  ('mdw-m1-c1', 'mdw-m1', 'Ch. 1 : La règle du "Demander"', '15m', 1),
  ('mdw-m1-c2', 'mdw-m1', 'Ch. 2 : Trouver son idée de niche locale', '20m', 2),
  -- mdw-m2 (2)
  ('mdw-m2-c1', 'mdw-m2', 'Ch. 3 : L''art de collecter 3 pré-commandes', '25m', 1),
  ('mdw-m2-c2', 'mdw-m2', 'Ch. 4 : Adapter l''offre en fonction du signal de marché', '20m', 2),

  -- offers-m1 (3)
  ('offers-m1-c1', 'offers-m1', 'Ch. 1 : Le résultat idéal perçu', '20m', 1),
  ('offers-m1-c2', 'offers-m1', 'Ch. 2 : Maximiser la certitude de réussite', '25m', 2),
  ('offers-m1-c3', 'offers-m1', 'Ch. 3 : Minimiser le délai et l''effort requis', '25m', 3),
  -- offers-m2 (2)
  ('offers-m2-c1', 'offers-m2', 'Ch. 4 : Résoudre le problème central et ses dépendances', '30m', 1),
  ('offers-m2-c2', 'offers-m2', 'Ch. 5 : Offrir des garanties inconditionnelles', '25m', 2),

  -- bc-m1 (2)
  ('bc-m1-c1', 'bc-m1', 'Ch. 1 : Éliminer les intermédiaires traditionnels', '20m', 1),
  ('bc-m1-c2', 'bc-m1', 'Ch. 2 : Construire une communauté de fans engagés', '20m', 2),
  -- bc-m2 (2)
  ('bc-m2-c1', 'bc-m2', 'Ch. 3 : Garder le contrôle sur la production', '25m', 1),
  ('bc-m2-c2', 'bc-m2', 'Ch. 4 : L''importance des retours et du support client', '25m', 2),

  -- cc-m1 (3)
  ('cc-m1-c1', 'cc-m1', 'Ch. 1 : Installation et configuration globale', '15m', 1),
  ('cc-m1-c2', 'cc-m1', 'Ch. 2 : Syntaxe et structure des prompts techniques', '20m', 2),
  ('cc-m1-c3', 'cc-m1', 'Ch. 3 : L''Air Lock en 3 tours pour éviter les dérives', '25m', 3),
  -- cc-m2 (2)
  ('cc-m2-c1', 'cc-m2', 'Ch. 4 : Appliquer des modifications chirurgicales dans un repo', '30m', 1),
  ('cc-m2-c2', 'cc-m2', 'Ch. 5 : Gérer le linting et le cycle de compilation GREEN', '20m', 2),

  -- codex-m1 (2)
  ('codex-m1-c1', 'codex-m1', 'Ch. 1 : Installer Codex en environnement Windows/WSL', '15m', 1),
  ('codex-m1-c2', 'codex-m1', 'Ch. 2 : Configurer l''alias codexm et forcer $env:CODEX_HOME', '20m', 2),
  -- codex-m2 (2)
  ('codex-m2-c1', 'codex-m2', 'Ch. 3 : Comprendre le danger-full-access et le bypass de sandbox', '25m', 1),
  ('codex-m2-c2', 'codex-m2', 'Ch. 4 : Éviter le crash de tool call de MiniMax (Erreur 2013)', '25m', 2),

  -- gem-m1 (2)
  ('gem-m1-c1', 'gem-m1', 'Ch. 1 : Modèles Flash vs Pro : choix du runtime', '15m', 1),
  ('gem-m1-c2', 'gem-m1', 'Ch. 2 : Ingestion sémantique de dépôts de documents complets', '25m', 2),
  -- gem-m2 (2)
  ('gem-m2-c1', 'gem-m2', 'Ch. 3 : Extraction de données structurées depuis des captures et vidéos', '30m', 1),
  ('gem-m2-c2', 'gem-m2', 'Ch. 4 : Création de schémas Zod pour forcer la sortie JSON', '20m', 2),

  -- oc-m1 (2)
  ('oc-m1-c1', 'oc-m1', 'Ch. 1 : Concepts fondamentaux : Prompts systèmes et outils', '20m', 1),
  ('oc-m1-c2', 'oc-m1', 'Ch. 2 : Créer un orchestrateur d''agent avec Openclaw', '25m', 2),
  -- oc-m2 (2)
  ('oc-m2-c1', 'oc-m2', 'Ch. 3 : Connecter le tableau de bord de supervision', '25m', 1),
  ('oc-m2-c2', 'oc-m2', 'Ch. 4 : Gérer les queues de messages et tâches orphelines', '30m', 2),

  -- ha-m1 (2)
  ('ha-m1-c1', 'ha-m1', 'Ch. 1 : Choix du modèle : Llama-3-Hermes vs Qwen', '20m', 1),
  ('ha-m1-c2', 'ha-m1', 'Ch. 2 : Configuration d''ollama ou vLLM sur le VPS', '25m', 2),
  -- ha-m2 (2)
  ('ha-m2-c1', 'ha-m2', 'Ch. 3 : Lancer des requêtes structurées via curl et API locales', '20m', 1),
  ('ha-m2-c2', 'ha-m2', 'Ch. 4 : Mesurer le débit et la latence (tokens par seconde)', '25m', 2),

  -- mm-m1 (2)
  ('mm-m1-c1', 'mm-m1', 'Ch. 1 : Analyser le coût des prompts systèmes vs le contexte cumulé', '20m', 1),
  ('mm-m1-c2', 'mm-m1', 'Ch. 2 : Mettre en cache et optimiser les fenêtres de contexte', '20m', 2),
  -- mm-m2 (2)
  ('mm-m2-c1', 'mm-m2', 'Ch. 3 : Mettre en place des gardes-fous et alertes de budget', '25m', 1),
  ('mm-m2-c2', 'mm-m2', 'Ch. 4 : Choisir intelligemment entre modèle Flash et Pro', '20m', 2),

  -- lhl-m1 (3)
  ('lhl-m1-c1', 'lhl-m1', 'Ch. 1 : Comprendre le mode diffus du cerveau', '15m', 1),
  ('lhl-m1-c2', 'lhl-m1', 'Ch. 2 : Technique Pomodoro et lutte contre la distraction', '15m', 2),
  ('lhl-m1-c3', 'lhl-m1', 'Ch. 3 : Éviter l''illusion de compétence par le test actif', '20m', 3),
  -- lhl-m2 (2)
  ('lhl-m2-c1', 'lhl-m2', 'Ch. 4 : Le rôle fondamental du sommeil dans la mémoire', '20m', 1),
  ('lhl-m2-c2', 'lhl-m2', 'Ch. 5 : La technique de répétition espacée (Anki)', '25m', 2),

  -- ust-m1 (2)
  ('ust-m1-c1', 'ust-m1', 'Ch. 1 : Comprendre le mode diffus du cerveau', '20m', 1),
  ('ust-m1-c2', 'ust-m1', 'Ch. 2 : Technique de répétition espacée', '15m', 2),
  -- ust-m2 (2)
  ('ust-m2-c1', 'ust-m2', 'Ch. 3 : Schémas explicatifs vs apprentissage par la pratique', '25m', 1),
  ('ust-m2-c2', 'ust-m2', 'Ch. 4 : Créer des boucles de validation immédiates', '20m', 2),

  -- aol-m1 (2)
  ('aol-m1-c1', 'aol-m1', 'Ch. 1 : Apprendre à perdre pour mieux analyser', '20m', 1),
  ('aol-m1-c2', 'aol-m1', 'Ch. 2 : L''effet d''échelle et de simplicité', '20m', 2),
  -- aol-m2 (2)
  ('aol-m2-c1', 'aol-m2', 'Ch. 3 : Lier un état physique à un focus mental maximal', '25m', 1),
  ('aol-m2-c2', 'aol-m2', 'Ch. 4 : Ancrer sa routine de performance', '30m', 2),

  -- f20h-m1 (2)
  ('f20h-m1-c1', 'f20h-m1', 'Ch. 1 : Définir son objectif de performance minimal', '15m', 1),
  ('f20h-m1-c2', 'f20h-m1', 'Ch. 2 : Diviser la compétence en sous-parties d''apprentissage', '20m', 2),
  -- f20h-m2 (2)
  ('f20h-m2-c1', 'f20h-m2', 'Ch. 3 : Éliminer les barrières physiques et logicielles', '20m', 1),
  ('f20h-m2-c2', 'f20h-m2', 'Ch. 4 : Pratiquer 20 heures avec feedback instantané', '25m', 2),

  -- ul-m1 (2)
  ('ul-m1-c1', 'ul-m1', 'Ch. 1 : Cartographier les ressources et la structure du sujet', '20m', 1),
  ('ul-m1-c2', 'ul-m1', 'Ch. 2 : Choisir l''immersion directe plutôt que l''étude passive', '20m', 2),
  -- ul-m2 (2)
  ('ul-m2-c1', 'ul-m2', 'Ch. 3 : L''art de s''auto-tester de manière exigeante', '25m', 1),
  ('ul-m2-c2', 'ul-m2', 'Ch. 4 : Sur-apprentissage pour sceller la compétence', '25m', 2),

  -- mg-m1 (2)
  ('mg-m1-c1', 'mg-m1', 'Ch. 1 : Lecture active et prise de notes hiérarchique', '15m', 1),
  ('mg-m1-c2', 'mg-m1', 'Ch. 2 : Extraire les concepts fondamentaux (80/20)', '20m', 2),
  -- mg-m2 (2)
  ('mg-m2-c1', 'mg-m2', 'Ch. 3 : Structurer sa synthèse en standard Geordi Premium', '25m', 1),
  ('mg-m2-c2', 'mg-m2', 'Ch. 4 : Insérer des triggers et cas d''usages réels', '25m', 2),

  -- ik-m1 (3)
  ('ik-m1-c1', 'ik-m1', 'Ch. 1 : Ce que vous aimez (vos passions réelles)', '15m', 1),
  ('ik-m1-c2', 'ik-m1', 'Ch. 2 : Ce en quoi vous êtes doué (vos forces)', '15m', 2),
  ('ik-m1-c3', 'ik-m1', 'Ch. 3 : Ce dont le monde a besoin et ce pour quoi vous pouvez être payé', '20m', 3),
  -- ik-m2 (2)
  ('ik-m2-c1', 'ik-m2', 'Ch. 4 : Cartographier son Ikigai individuel et collectif', '30m', 1),
  ('ik-m2-c2', 'ik-m2', 'Ch. 5 : Éviter les désalignements majeurs en entreprise', '30m', 2),

  -- lw-m1 (2)
  ('lw-m1-c1', 'lw-m1', 'Ch. 1 : Les 8 piliers : Santé, Finance, Carrière, Couple, Social, Mental, Loisirs, Environnement', '25m', 1),
  ('lw-m1-c2', 'lw-m1', 'Ch. 2 : Établir son score initial de satisfaction', '15m', 2),
  -- lw-m2 (2)
  ('lw-m2-c1', 'lw-m2', 'Ch. 3 : Définir des actions concrètes pour les piliers faibles', '25m', 1),
  ('lw-m2-c2', 'lw-m2', 'Ch. 4 : Suivi mensuel et rituels d''ajustement', '20m', 2),

  -- 12wy-m1 (2)
  ('12wy-m1-c1', '12wy-m1', 'Ch. 1 : L''illusion de l''année de 12 mois', '20m', 1),
  ('12wy-m1-c2', '12wy-m1', 'Ch. 2 : L''urgence saine de la semaine de 7 jours', '15m', 2),
  -- 12wy-m2 (3)
  ('12wy-m2-c1', '12wy-m2', 'Ch. 3 : Écrire son plan tactique pour 12 semaines', '30m', 1),
  ('12wy-m2-c2', '12wy-m2', 'Ch. 4 : Score d''exécution hebdomadaire : mesurer l''action, pas le résultat', '20m', 2),
  ('12wy-m2-c3', '12wy-m2', 'Ch. 5 : Gérer le buffer de récupération', '20m', 3),

  -- sb-m1 (3)
  ('sb-m1-c1', 'sb-m1', 'Ch. 1 : L''importance d''un système externe de mémoire', '15m', 1),
  ('sb-m1-c2', 'sb-m1', 'Ch. 2 : Capturer la bonne information sans surcharge', '20m', 2),
  ('sb-m1-c3', 'sb-m1', 'Ch. 3 : Organiser selon l''actionnabilité', '20m', 3),
  -- sb-m2 (3)
  ('sb-m2-c1', 'sb-m2', 'Ch. 4 : P pour Projects (objectifs actifs)', '20m', 1),
  ('sb-m2-c2', 'sb-m2', 'Ch. 5 : A pour Areas (responsabilités permanentes)', '20m', 2),
  ('sb-m2-c3', 'sb-m2', 'Ch. 6 : R/A pour Resources & Archives', '35m', 3),

  -- gtd-m1 (3)
  ('gtd-m1-c1', 'gtd-m1', 'Ch. 1 : Capturer tout ce qui encombre l''esprit', '15m', 1),
  ('gtd-m1-c2', 'gtd-m1', 'Ch. 2 : Clarifier : décider si l''action est requise', '20m', 2),
  ('gtd-m1-c3', 'gtd-m1', 'Ch. 3 : Organiser : listes, agenda et dossiers de référence', '25m', 3),
  -- gtd-m2 (2)
  ('gtd-m2-c1', 'gtd-m2', 'Ch. 4 : La revue hebdomadaire (Weekly Review) : clé de voûte', '30m', 1),
  ('gtd-m2-c2', 'gtd-m2', 'Ch. 5 : Choisir l''action selon le contexte, le temps et l''énergie', '20m', 2),

  -- 4h-m1 (2)
  ('4h-m1-c1', '4h-m1', 'Ch. 1 : Définition de la philosophie des Nouveaux Riches', '20m', 1),
  ('4h-m1-c2', '4h-m1', 'Ch. 2 : Diète d''information et élimination du multitâche', '20m', 2),
  -- 4h-m2 (2)
  ('4h-m2-c1', '4h-m2', 'Ch. 3 : Sous-traiter sa vie et bâtir des "muses" de revenus', '30m', 1),
  ('4h-m2-c2', '4h-m2', 'Ch. 4 : Mobilité géographique et souveraineté temporelle', '25m', 2),

  -- bio-m1 (2)
  ('bio-m1-c1', 'bio-m1', 'Ch. 1 : Les 9 lois de la nature selon le biomimétisme', '20m', 1),
  ('bio-m1-c2', 'bio-m1', 'Ch. 2 : Passer du biomimétisme de forme au biomimétisme d''écosystème', '25m', 2),
  -- bio-m2 (2)
  ('bio-m2-c1', 'bio-m2', 'Ch. 3 : Études de cas : trains Shinkansen, climatisation des termitières', '25m', 1),
  ('bio-m2-c2', 'bio-m2', 'Ch. 4 : Matériaux bio-inspirés et chimie douce', '25m', 2),

  -- ce-m1 (2)
  ('ce-m1-c1', 'ce-m1', 'Ch. 1 : Le modèle linéaire "Prendre-Fabriquer-Jeter" et ses limites', '20m', 1),
  ('ce-m1-c2', 'ce-m1', 'Ch. 2 : Cycles techniques vs cycles biologiques', '25m', 2),
  -- ce-m2 (2)
  ('ce-m2-c1', 'ce-m2', 'Ch. 3 : L''économie de la fonctionnalité (louer au lieu de vendre)', '25m', 1),
  ('ce-m2-c2', 'ce-m2', 'Ch. 4 : Conception modulaire et réparabilité infinie', '30m', 2),

  -- be-m1 (2)
  ('be-m1-c1', 'be-m1', 'Ch. 1 : Travailler avec ce qui est localement disponible', '20m', 1),
  ('be-m1-c2', 'be-m1', 'Ch. 2 : Multiplier les sources de revenus (cas du café et des champignons)', '25m', 2),
  -- be-m2 (2)
  ('be-m2-c1', 'be-m2', 'Ch. 3 : Du déchet à la ressource : cycles de nutriments croisés', '25m', 1),
  ('be-m2-c2', 'be-m2', 'Ch. 4 : Énergie et physique de flux au lieu de la chimie lourde', '20m', 2),

  -- lt-m1 (2)
  ('lt-m1-c1', 'lt-m1', 'Ch. 1 : Définir la "Low-tech" face à la "High-tech"', '15m', 1),
  ('lt-m1-c2', 'lt-m1', 'Ch. 2 : Analyse du cycle de vie complet de nos outils', '20m', 2),
  -- lt-m2 (2)
  ('lt-m2-c1', 'lt-m2', 'Ch. 3 : Systèmes solaires thermiques, biogaz et conservation passive', '30m', 1),
  ('lt-m2-c2', 'lt-m2', 'Ch. 4 : L''importance des plans open-source pour la souveraineté technique', '25m', 2),

  -- ua-m1 (2)
  ('ua-m1-c1', 'ua-m1', 'Ch. 1 : Identifier les points de pression majeurs d''une ville', '20m', 1),
  ('ua-m1-c2', 'ua-m1', 'Ch. 2 : Curitiba : comment une impulsion transport a sauvé une ville', '20m', 2),
  -- ua-m2 (2)
  ('ua-m2-c1', 'ua-m2', 'Ch. 3 : Espaces publics partagés et urbanisme tactique', '25m', 1),
  ('ua-m2-c2', 'ua-m2', 'Ch. 4 : Connecter les citoyens à la nature urbaine', '15m', 2),

  -- ac-m1 (2)
  ('ac-m1-c1', 'ac-m1', 'Ch. 1 : L''échange de connaissance est à somme positive', '20m', 1),
  ('ac-m1-c2', 'ac-m1', 'Ch. 2 : Flux d''attention et flux d''information', '20m', 2),
  -- ac-m2 (2)
  ('ac-m2-c1', 'ac-m2', 'Ch. 3 : L''importance du biomimétisme conceptuel', '25m', 1),
  ('ac-m2-c2', 'ac-m2', 'Ch. 4 : Libérer la transmission de savoir : le standard Geordi', '20m', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. MIGRATION TRACKER
-- ============================================================================
INSERT INTO abc_os._aspace_migrations (filename) VALUES ('0006_seed_learn_hub.sql')
  ON CONFLICT (filename) DO NOTHING;
