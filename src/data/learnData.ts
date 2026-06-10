export interface Chapter {
  id: string;
  title: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  sub: string;
  desc: string;
  category: 'structuration' | 'agentic' | 'autodidact';
  progress: number;
  icon: string;
  accent: string;
  lessonsCount: number;
  duration: string;
  modules: Module[];
}

export const LEARN_CATEGORIES = [
  {
    id: 'structuration',
    title: 'Business Structuration',
    desc: 'Bâtir des coopératives et systèmes pérennes et transmissibles.',
    icon: 'layers',
    accent: 'var(--learn-green)',
  },
  {
    id: 'agentic',
    title: 'Architecture Agentique',
    desc: 'Co-piloter avec des swarms de collaborateurs synthétiques.',
    icon: 'construction',
    accent: 'var(--brand-gold)',
  },
  {
    id: 'autodidact',
    title: 'Apprentissage Autodidacte',
    desc: "Méthodologies d'assimilation accélérée de compétences.",
    icon: 'school',
    accent: 'var(--primary)',
  }
];

export const LEARN_COURSES: Course[] = [
  // === CATEGORY: Structuration ===
  {
    id: 'emyth',
    title: 'E-Myth Revisited',
    sub: 'Business Structuration',
    desc: 'Arrêter de travailler DANS sa coopérative pour travailler SUR sa coopérative. Structurer les rôles clés.',
    category: 'structuration',
    progress: 60,
    icon: 'layers',
    accent: 'var(--learn-green)',
    lessonsCount: 12,
    duration: '3h 15m',
    modules: [
      {
        id: 'emyth-m1',
        title: 'M1: Le Mythe de l\'Entrepreneur',
        chapters: [
          { id: 'emyth-m1-c1', title: 'Ch. 1 : Le technicien devenu fou', duration: '15m' },
          { id: 'emyth-m1-c2', title: 'Ch. 2 : Les trois personnalités : Technicien, Manager, Entrepreneur', duration: '20m' },
          { id: 'emyth-m1-c3', title: 'Ch. 3 : L\'enfance de l\'entreprise', duration: '15m' }
        ]
      },
      {
        id: 'emyth-m2',
        title: 'M2: La Révolution de la Franchise Clé en Main',
        chapters: [
          { id: 'emyth-m2-c1', title: 'Ch. 4 : Le prototype de franchise', duration: '20m' },
          { id: 'emyth-m2-c2', title: 'Ch. 5 : Penser son business comme un modèle duplicable', duration: '25m' }
        ]
      },
      {
        id: 'emyth-m3',
        title: 'M3: L\'Ingénierie des Rôles (Org Chart)',
        chapters: [
          { id: 'emyth-m3-c1', title: 'Ch. 6 : L\'organigramme axé sur les fonctions, pas les personnes', duration: '30m' },
          { id: 'emyth-m3-c2', title: 'Ch. 7 : Rédiger ses premières SOPs de référence', duration: '25m' },
          { id: 'emyth-m3-c3', title: 'Ch. 8 : L\'automatisation des flux de décision', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'built-to-sell',
    title: 'Built to Sell',
    sub: 'Business Structuration',
    desc: 'Comment créer une entreprise transmissible et indépendante de son fondateur en standardisant son offre.',
    category: 'structuration',
    progress: 0,
    icon: 'bookmark',
    accent: 'var(--learn-green)',
    lessonsCount: 8,
    duration: '2h 10m',
    modules: [
      {
        id: 'bts-m1',
        title: 'M1: Le Service Produit (Productized Service)',
        chapters: [
          { id: 'bts-m1-c1', title: 'Ch. 1 : Identifier le produit le plus standardisable', duration: '20m' },
          { id: 'bts-m1-c2', title: 'Ch. 2 : Éliminer la dépendance aux sur-mesure', duration: '15m' }
        ]
      },
      {
        id: 'bts-m2',
        title: 'M2: Indépendance & Processus',
        chapters: [
          { id: 'bts-m2-c1', title: 'Ch. 3 : Créer une équipe autonome', duration: '25m' },
          { id: 'bts-m2-c2', title: 'Ch. 4 : Structurer la facturation et le flux de trésorerie', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'who-not-how',
    title: 'Who Not How',
    sub: 'Business Structuration',
    desc: 'Apprendre à déléguer l\'exécution à des experts humains ou à des agents synthétiques.',
    category: 'structuration',
    progress: 0,
    icon: 'groups',
    accent: 'var(--learn-green)',
    lessonsCount: 10,
    duration: '2h 30m',
    modules: [
      {
        id: 'wnh-m1',
        title: 'M1: Penser en "Qui" au lieu de "Comment"',
        chapters: [
          { id: 'wnh-m1-c1', title: 'Ch. 1 : La libération de temps par la collaboration', duration: '20m' },
          { id: 'wnh-m1-c2', title: 'Ch. 2 : Évaluer sa valeur horaire réelle', duration: '15m' }
        ]
      },
      {
        id: 'wnh-m2',
        title: 'M2: Délégation Systémique',
        chapters: [
          { id: 'wnh-m2-c1', title: 'Ch. 3 : Rôles complémentaires et alignement', duration: '25m' },
          { id: 'wnh-m2-c2', title: 'Ch. 4 : Handoffs clairs et critères d\'acceptation', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'million-dollar-weekend',
    title: 'Million Dollar Weekend',
    sub: 'Business Structuration',
    desc: 'Validation ultra-rapide des idées de business en 48 heures sans dépenser de budget.',
    category: 'structuration',
    progress: 0,
    icon: 'calendar_today',
    accent: 'var(--learn-green)',
    lessonsCount: 8,
    duration: '1h 55m',
    modules: [
      {
        id: 'mdw-m1',
        title: 'M1: Vaincre la Peur & Agir',
        chapters: [
          { id: 'mdw-m1-c1', title: 'Ch. 1 : La règle du "Demander"', duration: '15m' },
          { id: 'mdw-m1-c2', title: 'Ch. 2 : Trouver son idée de niche locale', duration: '20m' }
        ]
      },
      {
        id: 'mdw-m2',
        title: 'M2: La Validation Instantanée',
        chapters: [
          { id: 'mdw-m2-c1', title: 'Ch. 3 : L\'art de collecter 3 pré-commandes', duration: '25m' },
          { id: 'mdw-m2-c2', title: 'Ch. 4 : Adapter l\'offre en fonction du signal de marché', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'offers',
    title: '$100M Offers',
    sub: 'Business Structuration',
    desc: 'Créer des offres irrésistibles qui maximisent la valeur perçue et détruisent la concurrence.',
    category: 'structuration',
    progress: 20,
    icon: 'workspace_premium',
    accent: 'var(--learn-green)',
    lessonsCount: 14,
    duration: '3h 40m',
    modules: [
      {
        id: 'offers-m1',
        title: 'M1: L\'Équation de la Valeur',
        chapters: [
          { id: 'offers-m1-c1', title: 'Ch. 1 : Le résultat idéal perçu', duration: '20m' },
          { id: 'offers-m1-c2', title: 'Ch. 2 : Maximiser la certitude de réussite', duration: '25m' },
          { id: 'offers-m1-c3', title: 'Ch. 3 : Minimiser le délai et l\'effort requis', duration: '25m' }
        ]
      },
      {
        id: 'offers-m2',
        title: 'M2: Structurer l\'Offre',
        chapters: [
          { id: 'offers-m2-c1', title: 'Ch. 4 : Résoudre le problème central et ses dépendances', duration: '30m' },
          { id: 'offers-m2-c2', title: 'Ch. 5 : Offrir des garanties inconditionnelles', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'brand-club',
    title: 'Billion Dollar Brand Club',
    sub: 'Business Structuration',
    desc: 'Concevoir des marques Direct-to-Consumer (DTC) fortes en maîtrisant sa relation client et sa logistique.',
    category: 'structuration',
    progress: 0,
    icon: 'campaign',
    accent: 'var(--learn-green)',
    lessonsCount: 9,
    duration: '2h 15m',
    modules: [
      {
        id: 'bc-m1',
        title: 'M1: La Révolution de la Marque Directe',
        chapters: [
          { id: 'bc-m1-c1', title: 'Ch. 1 : Éliminer les intermédiaires traditionnels', duration: '20m' },
          { id: 'bc-m1-c2', title: 'Ch. 2 : Construire une communauté de fans engagés', duration: '20m' }
        ]
      },
      {
        id: 'bc-m2',
        title: 'M2: Maîtrise de la Logistique & Qualité',
        chapters: [
          { id: 'bc-m2-c1', title: 'Ch. 3 : Garder le contrôle sur la production', duration: '25m' },
          { id: 'bc-m2-c2', title: 'Ch. 4 : L\'importance des retours et du support client', duration: '25m' }
        ]
      }
    ]
  },

  // === CATEGORY: Agentic ===
  {
    id: 'claude-code',
    title: 'Claude Code agnostique',
    sub: 'Architecture Agentique',
    desc: 'Maîtriser Claude Code CLI pour l\'ingénierie rapide de fichiers, la modification agile de code et le debug.',
    category: 'agentic',
    progress: 35,
    icon: 'construction',
    accent: 'var(--brand-gold)',
    lessonsCount: 8,
    duration: '2h 05m',
    modules: [
      {
        id: 'cc-m1',
        title: 'M1: Prise en main du terminal agile',
        chapters: [
          { id: 'cc-m1-c1', title: 'Ch. 1 : Installation et configuration globale', duration: '15m' },
          { id: 'cc-m1-c2', title: 'Ch. 2 : Syntaxe et structure des prompts techniques', duration: '20m' },
          { id: 'cc-m1-c3', title: 'Ch. 3 : L\'Air Lock en 3 tours pour éviter les dérives', duration: '25m' }
        ]
      },
      {
        id: 'cc-m2',
        title: 'M2: Ingenerie & Refactoring',
        chapters: [
          { id: 'cc-m2-c1', title: 'Ch. 4 : Appliquer des modifications chirurgicales dans un repo', duration: '30m' },
          { id: 'cc-m2-c2', title: 'Ch. 5 : Gérer le linting et le cycle de compilation GREEN', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'codex-cli',
    title: 'Codex CLI & Résilience',
    sub: 'Architecture Agentique',
    desc: 'Mettre en place Codex CLI (MiniMax-M3) avec alias codexm, configuration $env:CODEX_HOME et bypass d\'approbations.',
    category: 'agentic',
    progress: 0,
    icon: 'tune',
    accent: 'var(--brand-gold)',
    lessonsCount: 7,
    duration: '1h 45m',
    modules: [
      {
        id: 'codex-m1',
        title: 'M1: Configuration Souveraine',
        chapters: [
          { id: 'codex-m1-c1', title: 'Ch. 1 : Installer Codex en environnement Windows/WSL', duration: '15m' },
          { id: 'codex-m1-c2', title: 'Ch. 2 : Configurer l\'alias codexm et forcer $env:CODEX_HOME', duration: '20m' }
        ]
      },
      {
        id: 'codex-m2',
        title: 'M2: Sécurité et Bypass d\'Approbations',
        chapters: [
          { id: 'codex-m2-c1', title: 'Ch. 3 : Comprendre le danger-full-access et le bypass de sandbox', duration: '25m' },
          { id: 'codex-m2-c2', title: 'Ch. 4 : Éviter le crash de tool call de MiniMax (Erreur 2013)', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'gemini-sdk',
    title: 'Gemini SDK & Large Contexte',
    sub: 'Architecture Agentique',
    desc: 'Développer des intégrations avec Gemini 1.5 pour le traitement de fenêtres de contextes à 2M de tokens.',
    category: 'agentic',
    progress: 0,
    icon: 'bolt',
    accent: 'var(--brand-gold)',
    lessonsCount: 9,
    duration: '2h 20m',
    modules: [
      {
        id: 'gem-m1',
        title: 'M1: RAG à Contexte Géant',
        chapters: [
          { id: 'gem-m1-c1', title: 'Ch. 1 : Modèles Flash vs Pro : choix du runtime', duration: '15m' },
          { id: 'gem-m1-c2', title: 'Ch. 2 : Ingestion sémantique de dépôts de documents complets', duration: '25m' }
        ]
      },
      {
        id: 'gem-m2',
        title: 'M2: Analyse Multimodale',
        chapters: [
          { id: 'gem-m2-c1', title: 'Ch. 3 : Extraction de données structurées depuis des captures et vidéos', duration: '30m' },
          { id: 'gem-m2-c2', title: 'Ch. 4 : Création de schémas Zod pour forcer la sortie JSON', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'openclaw',
    title: 'Openclaw Framework',
    sub: 'Architecture Agentique',
    desc: 'Mettre en place une architecture d\'agents et monitorer leur activité via le tableau de bord Openclaw.',
    category: 'agentic',
    progress: 10,
    icon: 'trending_up',
    accent: 'var(--brand-gold)',
    lessonsCount: 11,
    duration: '2h 50m',
    modules: [
      {
        id: 'oc-m1',
        title: 'M1: Architecture Multi-Agents',
        chapters: [
          { id: 'oc-m1-c1', title: 'Ch. 1 : Concepts fondamentaux : Prompts systèmes et outils', duration: '20m' },
          { id: 'oc-m1-c2', title: 'Ch. 2 : Créer un orchestrateur d\'agent avec Openclaw', duration: '25m' }
        ]
      },
      {
        id: 'oc-m2',
        title: 'M2: Monitoring & Mission Control',
        chapters: [
          { id: 'oc-m2-c1', title: 'Ch. 3 : Connecter le tableau de bord de supervision', duration: '25m' },
          { id: 'oc-m2-c2', title: 'Ch. 4 : Gérer les queues de messages et tâches orphelines', duration: '30m' }
        ]
      }
    ]
  },
  {
    id: 'hermes-agents',
    title: 'Hermes Agents & Inférence Locale',
    sub: 'Architecture Agentique',
    desc: 'Déployer des modèles souverains fine-tunés en local ou sur VPS pour s\'affranchir des services cloud fermés.',
    category: 'agentic',
    progress: 0,
    icon: 'account_balance',
    accent: 'var(--brand-gold)',
    lessonsCount: 8,
    duration: '2h 10m',
    modules: [
      {
        id: 'ha-m1',
        title: 'M1: Servir un Modèle Localement',
        chapters: [
          { id: 'ha-m1-c1', title: 'Ch. 1 : Choix du modèle : Llama-3-Hermes vs Qwen', duration: '20m' },
          { id: 'ha-m1-c2', title: 'Ch. 2 : Configuration d\'ollama ou vLLM sur le VPS', duration: '25m' }
        ]
      },
      {
        id: 'ha-m2',
        title: 'M2: Intégration dans le Workflow',
        chapters: [
          { id: 'ha-m2-c1', title: 'Ch. 3 : Lancer des requêtes structurées via curl et API locales', duration: '20m' },
          { id: 'ha-m2-c2', title: 'Ch. 4 : Mesurer le débit et la latence (tokens par seconde)', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'minimax-tokens',
    title: 'Minimax Token Plan',
    sub: 'Architecture Agentique',
    desc: 'Planification budgétaire de la consommation d\'API, routage intelligent de prompts et limitation de coûts.',
    category: 'agentic',
    progress: 0,
    icon: 'analytics',
    accent: 'var(--brand-gold)',
    lessonsCount: 6,
    duration: '1h 30m',
    modules: [
      {
        id: 'mm-m1',
        title: 'M1: Optimisation Financière',
        chapters: [
          { id: 'mm-m1-c1', title: 'Ch. 1 : Analyser le coût des prompts systèmes vs le contexte cumulé', duration: '20m' },
          { id: 'mm-m1-c2', title: 'Ch. 2 : Mettre en cache et optimiser les fenêtres de contexte', duration: '20m' }
        ]
      },
      {
        id: 'mm-m2',
        title: 'M2: Limitation des Risques',
        chapters: [
          { id: 'mm-m2-c1', title: 'Ch. 3 : Mettre en place des gardes-fous et alertes de budget', duration: '25m' },
          { id: 'mm-m2-c2', title: 'Ch. 4 : Choisir intelligemment entre modèle Flash et Pro', duration: '20m' }
        ]
      }
    ]
  },

  // === CATEGORY: Autodidact ===
  {
    id: 'learning-how-to-learn',
    title: 'Learning How to Learn',
    sub: 'Apprentissage Autodidacte',
    desc: 'Exploiter les modes concentrés et diffus, les techniques Pomodoro et contrer la procrastination.',
    category: 'autodidact',
    progress: 45,
    icon: 'book',
    accent: 'var(--primary)',
    lessonsCount: 10,
    duration: '2h 15m',
    modules: [
      {
        id: 'lhl-m1',
        title: 'M1: Focus & Diffusion',
        chapters: [
          { id: 'lhl-m1-c1', title: 'Ch. 1 : Comprendre le mode diffus du cerveau', duration: '15m' },
          { id: 'lhl-m1-c2', title: 'Ch. 2 : Technique Pomodoro et lutte contre la distraction', duration: '15m' },
          { id: 'lhl-m1-c3', title: 'Ch. 3 : Éviter l\'illusion de compétence par le test actif', duration: '20m' }
        ]
      },
      {
        id: 'lhl-m2',
        title: 'M2: Consolidation et Sommeil',
        chapters: [
          { id: 'lhl-m2-c1', title: 'Ch. 4 : Le rôle fondamental du sommeil dans la mémoire', duration: '20m' },
          { id: 'lhl-m2-c2', title: 'Ch. 5 : La technique de répétition espacée (Anki)', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'uncommon-sense',
    title: 'Uncommon Sense Teaching',
    sub: 'Apprentissage Autodidacte',
    desc: 'Neurosciences appliquées à la transmission rapide de compétences et consolidation mnésique.',
    category: 'autodidact',
    progress: 0,
    icon: 'school',
    accent: 'var(--primary)',
    lessonsCount: 8,
    duration: '2h 00m',
    modules: [
      {
        id: 'ust-m1',
        title: 'M1: Neurobiologie de l\'Attention',
        chapters: [
          { id: 'ust-m1-c1', title: 'Ch. 1 : Comment le cerveau encode une nouvelle information', duration: '20m' },
          { id: 'ust-m1-c2', title: 'Ch. 2 : Capturer l\'attention d\'un apprenant fatigué', duration: '15m' }
        ]
      },
      {
        id: 'ust-m2',
        title: 'M2: Structuration de l\'Onboarding',
        chapters: [
          { id: 'ust-m2-c1', title: 'Ch. 3 : Schémas explicatifs vs apprentissage par la pratique', duration: '25m' },
          { id: 'ust-m2-c2', title: 'Ch. 4 : Créer des boucles de validation immédiates', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'art-of-learning',
    title: 'The Art of Learning',
    sub: 'Apprentissage Autodidacte',
    desc: 'Josh Waitzkin : Approche de la haute performance, perte pour gain, et ancrage d\'états de flux.',
    category: 'autodidact',
    progress: 0,
    icon: 'workspace_premium',
    accent: 'var(--primary)',
    lessonsCount: 12,
    duration: '3h 10m',
    modules: [
      {
        id: 'aol-m1',
        title: 'M1: La Maîtrise des Fondamentaux',
        chapters: [
          { id: 'aol-m1-c1', title: 'Ch. 1 : Apprendre à perdre pour mieux analyser', duration: '20m' },
          { id: 'aol-m1-c2', title: 'Ch. 2 : L\'effet d\'échelle et de simplicité', duration: '20m' }
        ]
      },
      {
        id: 'aol-m2',
        title: 'M2: Routine d\'Ancrage du Flux',
        chapters: [
          { id: 'aol-m2-c1', title: 'Ch. 3 : Lier un état physique à un focus mental maximal', duration: '25m' },
          { id: 'aol-m2-c2', title: 'Ch. 4 : Ancrer sa routine de performance', duration: '30m' }
        ]
      }
    ]
  },
  {
    id: 'first-20-hours',
    title: 'The First 20 Hours',
    sub: 'Apprentissage Autodidacte',
    desc: 'Déconstruire une compétence pour apprendre le minimum requis en 20 heures de pratique ciblée.',
    category: 'autodidact',
    progress: 0,
    icon: 'calendar_today',
    accent: 'var(--primary)',
    lessonsCount: 7,
    duration: '1h 40m',
    modules: [
      {
        id: 'f20h-m1',
        title: 'M1: Déconstruction & Simplification',
        chapters: [
          { id: 'f20h-m1-c1', title: 'Ch. 1 : Définir son objectif de performance minimal', duration: '15m' },
          { id: 'f20h-m1-c2', title: 'Ch. 2 : Diviser la compétence en sous-parties d\'apprentissage', duration: '20m' }
        ]
      },
      {
        id: 'f20h-m2',
        title: 'M2: Pratique Délibérée',
        chapters: [
          { id: 'f20h-m2-c1', title: 'Ch. 3 : Éliminer les barrières physiques et logicielles', duration: '20m' },
          { id: 'f20h-m2-c2', title: 'Ch. 4 : Pratiquer 20 heures avec feedback instantané', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'ultralearning',
    title: 'Ultralearning',
    sub: 'Apprentissage Autodidacte',
    desc: 'Scott Young : Apprentissage intensif auto-dirigé, immersion, métacognition et suppression de friction.',
    category: 'autodidact',
    progress: 0,
    icon: 'search',
    accent: 'var(--primary)',
    lessonsCount: 9,
    duration: '2h 25m',
    modules: [
      {
        id: 'ul-m1',
        title: 'M1: Conception du Projet d\'Étude',
        chapters: [
          { id: 'ul-m1-c1', title: 'Ch. 1 : Cartographier les ressources et la structure du sujet', duration: '20m' },
          { id: 'ul-m1-c2', title: 'Ch. 2 : Choisir l\'immersion directe plutôt que l\'étude passive', duration: '20m' }
        ]
      },
      {
        id: 'ul-m2',
        title: 'M2: Feedback & Consolidation',
        chapters: [
          { id: 'ul-m2-c1', title: 'Ch. 3 : L\'art de s\'auto-tester de manière exigeante', duration: '25m' },
          { id: 'ul-m2-c2', title: 'Ch. 4 : Sur-apprentissage pour sceller la compétence', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'master-guides',
    title: 'Master Guides',
    sub: 'Apprentissage Autodidacte',
    desc: 'Ingestion rapide et distillation de connaissances massives sous standard Geordi Premium.',
    category: 'autodidact',
    progress: 15,
    icon: 'edit',
    accent: 'var(--primary)',
    lessonsCount: 8,
    duration: '2h 00m',
    modules: [
      {
        id: 'mg-m1',
        title: 'M1: Distillation Rapide',
        chapters: [
          { id: 'mg-m1-c1', title: 'Ch. 1 : Lecture active et prise de notes hiérarchique', duration: '15m' },
          { id: 'mg-m1-c2', title: 'Ch. 2 : Extraire les concepts fondamentaux (80/20)', duration: '20m' }
        ]
      },
      {
        id: 'mg-m2',
        title: 'M2: Formalisation Geordi Guide',
        chapters: [
          { id: 'mg-m2-c1', title: 'Ch. 3 : Structurer sa synthèse en standard Geordi Premium', duration: '25m' },
          { id: 'mg-m2-c2', title: 'Ch. 4 : Insérer des triggers et cas d\'usages réels', duration: '25m' }
        ]
      }
    ]
  }
];
