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
  category: 'structuration' | 'agentic' | 'autodidact' | 'productivity' | 'solarpunk';
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
  },
  {
    id: 'productivity',
    title: 'Personal Productivity',
    desc: 'Optimiser son énergie, son temps et son organisation au quotidien.',
    icon: 'schedule',
    accent: 'var(--build-blue)',
  },
  {
    id: 'solarpunk',
    title: 'Solarpunk Civilisation',
    desc: 'Concevoir des futurs durables, circulaires et low-tech.',
    icon: 'eco',
    accent: 'var(--community)',
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
          { id: 'ust-m1-c1', title: 'Ch. 1 : Comprendre le mode diffus du cerveau', duration: '20m' },
          { id: 'ust-m1-c2', title: 'Ch. 2 : Technique de répétition espacée', duration: '15m' }
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
  },

  // === CATEGORY: Productivity ===
  {
    id: 'ikigai',
    title: 'Ikigai',
    sub: 'Personal Productivity',
    desc: 'Trouver sa raison d\'être et aligner passion, mission, vocation et profession au quotidien.',
    category: 'productivity',
    progress: 50,
    icon: 'favorite',
    accent: 'var(--build-blue)',
    lessonsCount: 8,
    duration: '1h 50m',
    modules: [
      {
        id: 'ik-m1',
        title: 'M1: Les Quatre Cercles de l\'Ikigai',
        chapters: [
          { id: 'ik-m1-c1', title: 'Ch. 1 : Ce que vous aimez (vos passions réelles)', duration: '15m' },
          { id: 'ik-m1-c2', title: 'Ch. 2 : Ce en quoi vous êtes doué (vos forces)', duration: '15m' },
          { id: 'ik-m1-c3', title: 'Ch. 3 : Ce dont le monde a besoin et ce pour quoi vous pouvez être payé', duration: '20m' }
        ]
      },
      {
        id: 'ik-m2',
        title: 'M2: Alignement & Planification',
        chapters: [
          { id: 'ik-m2-c1', title: 'Ch. 4 : Cartographier son Ikigai individuel et collectif', duration: '30m' },
          { id: 'ik-m2-c2', title: 'Ch. 5 : Éviter les désalignements majeurs en entreprise', duration: '30m' }
        ]
      }
    ]
  },
  {
    id: 'lifewheel',
    title: 'Life Wheel',
    sub: 'Personal Productivity',
    desc: 'Évaluer et équilibrer régulièrement les 8 dimensions de vie pour une efficacité saine et sans épuisement.',
    category: 'productivity',
    progress: 0,
    icon: 'change_history',
    accent: 'var(--build-blue)',
    lessonsCount: 6,
    duration: '1h 25m',
    modules: [
      {
        id: 'lw-m1',
        title: 'M1: Cartographie de la Roue de Vie',
        chapters: [
          { id: 'lw-m1-c1', title: 'Ch. 1 : Les 8 piliers : Santé, Finance, Carrière, Couple, Social, Mental, Loisirs, Environnement', duration: '25m' },
          { id: 'lw-m1-c2', title: 'Ch. 2 : Établir son score initial de satisfaction', duration: '15m' }
        ]
      },
      {
        id: 'lw-m2',
        title: 'M2: Plan de Rééquilibrage',
        chapters: [
          { id: 'lw-m2-c1', title: 'Ch. 3 : Définir des actions concrètes pour les piliers faibles', duration: '25m' },
          { id: 'lw-m2-c2', title: 'Ch. 4 : Suivi mensuel et rituels d\'ajustement', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: '12wy',
    title: '12 Weeks Year',
    sub: 'Personal Productivity',
    desc: 'Condenser ses objectifs annuels en sprints de 12 semaines pour forcer l\'action et le focus.',
    category: 'productivity',
    progress: 0,
    icon: 'hourglass_empty',
    accent: 'var(--build-blue)',
    lessonsCount: 10,
    duration: '2h 45m',
    modules: [
      {
        id: '12wy-m1',
        title: 'M1: Redéfinir son Horizon Temporel',
        chapters: [
          { id: '12wy-m1-c1', title: 'Ch. 1 : L\'illusion de l\'année de 12 mois', duration: '20m' },
          { id: '12wy-m1-c2', title: 'Ch. 2 : L\'urgence saine de la semaine de 7 jours', duration: '15m' }
        ]
      },
      {
        id: '12wy-m2',
        title: 'M2: Planifier & Mesurer son Sprint',
        chapters: [
          { id: '12wy-m2-c1', title: 'Ch. 3 : Écrire son plan tactique pour 12 semaines', duration: '30m' },
          { id: '12wy-m2-c2', title: 'Ch. 4 : Score d\'exécution hebdomadaire : mesurer l\'action, pas le résultat', duration: '20m' },
          { id: '12wy-m2-c3', title: 'Ch. 5 : Gérer le buffer de récupération', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'secondbrain',
    title: 'Second Brain PARA',
    sub: 'Personal Productivity',
    desc: 'Organiser et stocker efficacement ses notes et documents avec la méthodologie de Tiago Forte.',
    category: 'productivity',
    progress: 10,
    icon: 'cloud_queue',
    accent: 'var(--build-blue)',
    lessonsCount: 9,
    duration: '2h 10m',
    modules: [
      {
        id: 'sb-m1',
        title: 'M1: Capturer & Filtrer (CODE)',
        chapters: [
          { id: 'sb-m1-c1', title: 'Ch. 1 : L\'importance d\'un système externe de mémoire', duration: '15m' },
          { id: 'sb-m1-c2', title: 'Ch. 2 : Capturer la bonne information sans surcharge', duration: '20m' },
          { id: 'sb-m1-c3', title: 'Ch. 3 : Organiser selon l\'actionnabilité', duration: '20m' }
        ]
      },
      {
        id: 'sb-m2',
        title: 'M2: La Structure P.A.R.A.',
        chapters: [
          { id: 'sb-m2-c1', title: 'Ch. 4 : P pour Projects (objectifs actifs)', duration: '20m' },
          { id: 'sb-m2-c2', title: 'Ch. 5 : A pour Areas (responsabilités permanentes)', duration: '20m' },
          { id: 'sb-m2-c3', title: 'Ch. 6 : R/A pour Resources & Archives', duration: '35m' }
        ]
      }
    ]
  },
  {
    id: 'gtd',
    title: 'Getting Things Done',
    sub: 'Personal Productivity',
    desc: 'La méthode incontournable de David Allen pour libérer sa charge mentale et structurer ses tâches.',
    category: 'productivity',
    progress: 0,
    icon: 'task_alt',
    accent: 'var(--build-blue)',
    lessonsCount: 11,
    duration: '3h 05m',
    modules: [
      {
        id: 'gtd-m1',
        title: 'M1: Les 5 Étapes du Flux de Travail',
        chapters: [
          { id: 'gtd-m1-c1', title: 'Ch. 1 : Capturer tout ce qui encombre l\'esprit', duration: '15m' },
          { id: 'gtd-m1-c2', title: 'Ch. 2 : Clarifier : décider si l\'action est requise', duration: '20m' },
          { id: 'gtd-m1-c3', title: 'Ch. 3 : Organiser : listes, agenda et dossiers de référence', duration: '25m' }
        ]
      },
      {
        id: 'gtd-m2',
        title: 'M2: Réflexion & Engagement',
        chapters: [
          { id: 'gtd-m2-c1', title: 'Ch. 4 : La revue hebdomadaire (Weekly Review) : clé de voûte', duration: '30m' },
          { id: 'gtd-m2-c2', title: 'Ch. 5 : Choisir l\'action selon le contexte, le temps et l\'énergie', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: '4h-workweek',
    title: '4H Workweek D.E.A.L',
    sub: 'Personal Productivity',
    desc: 'Définir de nouvelles règles du jeu, éliminer le superflu, automatiser ses revenus et se libérer.',
    category: 'productivity',
    progress: 0,
    icon: 'explore',
    accent: 'var(--build-blue)',
    lessonsCount: 8,
    duration: '2h 20m',
    modules: [
      {
        id: '4h-m1',
        title: 'M1: Définir & Éliminer (D & E)',
        chapters: [
          { id: '4h-m1-c1', title: 'Ch. 1 : Définition de la philosophie des Nouveaux Riches', duration: '20m' },
          { id: '4h-m1-c2', title: 'Ch. 2 : Diète d\'information et élimination du multitâche', duration: '20m' }
        ]
      },
      {
        id: '4h-m2',
        title: 'M2: Automatiser & Libérer (A & L)',
        chapters: [
          { id: '4h-m2-c1', title: 'Ch. 3 : Sous-traiter sa vie et bâtir des "muses" de revenus', duration: '30m' },
          { id: '4h-m2-c2', title: 'Ch. 4 : Mobilité géographique et souveraineté temporelle', duration: '25m' }
        ]
      }
    ]
  },

  // === CATEGORY: Solarpunk ===
  {
    id: 'biomimetisme',
    title: 'Biomimétisme',
    sub: 'Solarpunk Civilisation',
    desc: 'S\'inspirer des modèles et stratégies de la nature pour concevoir des technologies et systèmes résilients.',
    category: 'solarpunk',
    progress: 0,
    icon: 'park',
    accent: 'var(--community)',
    lessonsCount: 8,
    duration: '2h 15m',
    modules: [
      {
        id: 'bio-m1',
        title: 'M1: Nature comme Modèle (Janine Benyus)',
        chapters: [
          { id: 'bio-m1-c1', title: 'Ch. 1 : Les 9 lois de la nature selon le biomimétisme', duration: '20m' },
          { id: 'bio-m1-c2', title: 'Ch. 2 : Passer du biomimétisme de forme au biomimétisme d\'écosystème', duration: '25m' }
        ]
      },
      {
        id: 'bio-m2',
        title: 'M2: Applications Pratiques',
        chapters: [
          { id: 'bio-m2-c1', title: 'Ch. 3 : Études de cas : trains Shinkansen, climatisation des termitières', duration: '25m' },
          { id: 'bio-m2-c2', title: 'Ch. 4 : Matériaux bio-inspirés et chimie douce', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'circular-economy',
    title: 'Circular Economy',
    sub: 'Solarpunk Civilisation',
    desc: 'Repenser nos cycles industriels pour éliminer le concept même de déchet (fondation Ellen MacArthur).',
    category: 'solarpunk',
    progress: 15,
    icon: 'sync',
    accent: 'var(--community)',
    lessonsCount: 9,
    duration: '2h 30m',
    modules: [
      {
        id: 'ce-m1',
        title: 'M1: Éliminer les Déchets dès la Conception',
        chapters: [
          { id: 'ce-m1-c1', title: 'Ch. 1 : Le modèle linéaire "Prendre-Fabriquer-Jeter" et ses limites', duration: '20m' },
          { id: 'ce-m1-c2', title: 'Ch. 2 : Cycles techniques vs cycles biologiques', duration: '25m' }
        ]
      },
      {
        id: 'ce-m2',
        title: 'M2: Modèles d\'Affaires Circulaires',
        chapters: [
          { id: 'ce-m2-c1', title: 'Ch. 3 : L\'économie de la fonctionnalité (louer au lieu de vendre)', duration: '25m' },
          { id: 'ce-m2-c2', title: 'Ch. 4 : Conception modulaire et réparabilité infinie', duration: '30m' }
        ]
      }
    ]
  },
  {
    id: 'blue-economy',
    title: 'Blue Economy',
    sub: 'Solarpunk Civilisation',
    desc: 'Créer de la valeur locale en s\'appuyant sur les ressources disponibles à la manière des écosystèmes.',
    category: 'solarpunk',
    progress: 0,
    icon: 'water',
    accent: 'var(--community)',
    lessonsCount: 7,
    duration: '1h 55m',
    modules: [
      {
        id: 'be-m1',
        title: 'M1: Les Principes de Gunter Pauli',
        chapters: [
          { id: 'be-m1-c1', title: 'Ch. 1 : Travailler avec ce qui est localement disponible', duration: '20m' },
          { id: 'be-m1-c2', title: 'Ch. 2 : Multiplier les sources de revenus (cas du café et des champignons)', duration: '25m' }
        ]
      },
      {
        id: 'be-m2',
        title: 'M2: Innovations & Biomimétisme Économique',
        chapters: [
          { id: 'be-m2-c1', title: 'Ch. 3 : Du déchet à la ressource : cycles de nutriments croisés', duration: '25m' },
          { id: 'be-m2-c2', title: 'Ch. 4 : Énergie et physique de flux au lieu de la chimie lourde', duration: '20m' }
        ]
      }
    ]
  },
  {
    id: 'low-tech',
    title: 'Low Tech',
    sub: 'Solarpunk Civilisation',
    desc: 'Développer des technologies utiles, durables, réparables et localement appropriables.',
    category: 'solarpunk',
    progress: 0,
    icon: 'handyman',
    accent: 'var(--community)',
    lessonsCount: 8,
    duration: '2h 10m',
    modules: [
      {
        id: 'lt-m1',
        title: 'M1: Utilité, Sobriété, Accessibilité',
        chapters: [
          { id: 'lt-m1-c1', title: 'Ch. 1 : Définir la "Low-tech" face à la "High-tech"', duration: '15m' },
          { id: 'lt-m1-c2', title: 'Ch. 2 : Analyse du cycle de vie complet de nos outils', duration: '20m' }
        ]
      },
      {
        id: 'lt-m2',
        title: 'M2: Catalogue d\'Innovations Low-Tech',
        chapters: [
          { id: 'lt-m2-c1', title: 'Ch. 3 : Systèmes solaires thermiques, biogaz et conservation passive', duration: '30m' },
          { id: 'lt-m2-c2', title: 'Ch. 4 : L\'importance des plans open-source pour la souveraineté technique', duration: '25m' }
        ]
      }
    ]
  },
  {
    id: 'urban-acupuncture',
    title: 'Urban Acupuncture',
    sub: 'Solarpunk Civilisation',
    desc: 'Jaime Lerner : Revitaliser l\'écosystème urbain via des impulsions et micro-interventions ciblées.',
    category: 'solarpunk',
    progress: 0,
    icon: 'location_city',
    accent: 'var(--community)',
    lessonsCount: 6,
    duration: '1h 35m',
    modules: [
      {
        id: 'ua-m1',
        title: 'M1: La Ville comme Organisme Vivant',
        chapters: [
          { id: 'ua-m1-c1', title: 'Ch. 1 : Identifier les points de pression majeurs d\'une ville', duration: '20m' },
          { id: 'ua-m1-c2', title: 'Ch. 2 : Curitiba : comment une impulsion transport a sauvé une ville', duration: '20m' }
        ]
      },
      {
        id: 'ua-m2',
        title: 'M2: Interventions Légères & Impact Majeur',
        chapters: [
          { id: 'ua-m2-c1', title: 'Ch. 3 : Espaces publics partagés et urbanisme tactique', duration: '25m' },
          { id: 'ua-m2-c2', title: 'Ch. 4 : Connecter les citoyens à la nature urbaine', duration: '15m' }
        ]
      }
    ]
  },
  {
    id: 'age-connaissance',
    title: 'L\'âge de la Connaissance',
    sub: 'Solarpunk Civilisation',
    desc: 'Idriss Aberkane : Comprendre l\'économie de la connaissance (ressource infinie) pour concevoir l\'avenir.',
    category: 'solarpunk',
    progress: 0,
    icon: 'psychology',
    accent: 'var(--community)',
    lessonsCount: 8,
    duration: '2h 05m',
    modules: [
      {
        id: 'ac-m1',
        title: 'M1: Les Lois de la Connaissance',
        chapters: [
          { id: 'ac-m1-c1', title: 'Ch. 1 : L\'échange de connaissance est à somme positive', duration: '20m' },
          { id: 'ac-m1-c2', title: 'Ch. 2 : Flux d\'attention et flux d\'information', duration: '20m' }
        ]
      },
      {
        id: 'ac-m2',
        title: 'M2: Noopolitique et Souveraineté',
        chapters: [
          { id: 'ac-m2-c1', title: 'Ch. 3 : L\'importance du biomimétisme conceptuel', duration: '25m' },
          { id: 'ac-m2-c2', title: 'Ch. 4 : Libérer la transmission de savoir : le standard Geordi', duration: '20m' }
        ]
      }
    ]
  }
];
