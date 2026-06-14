import { AppData } from '@/types';

/**
 * i18n note (2026-06-14, bug 12): Per ADR-META-001 D3 + doctrine 2026-06-13
 * ("EN default, FR is temporary drift to normalize"), all canonical user-facing
 * strings live in the en.json i18n catalog. The mock data here carries the
 * structured `kind` + `data` payload that the i18n templates under
 * `dashboard.actions.*` and `dashboard.activity.*` consume. Translating back
 * to FR is out of scope (FR is not yet a locale per src/i18n/routing.ts).
 */
export const HUB_CONFIG = {
  community: { c: 'var(--community)', ico: 'groups', label: 'THE ASSEMBLY', name: 'Community', href: '/community' },
  learn: { c: 'var(--learn-green)', ico: 'school', label: 'CULTIVATING KNOWLEDGE', name: 'Learn', href: '/learn' },
  build: { c: 'var(--build-blue)', ico: 'construction', label: 'BUILDING TOGETHER', name: 'Build', href: '/build-hub' },
  brand: { c: 'var(--brand-gold)', ico: 'verified', label: 'YOUR COLLECTIVE IDENTITY', name: 'Brand', href: '/brand' },
};

export const INITIAL_DATA: AppData = {
  member: { name: 'Amara', full: 'Amara Okonkwo', initials: 'AO', tint: 'linear-gradient(150deg,#FFC72C,#E57373)' },
  coop: 'Umoja Weavers',
  place: 'Nairobi, Kenya',
  notifications: 4,
  pulse: {
    community: { count: '5 new', meta: '3 events upcoming · #Legal #Startup active' },
    learn: { course: 'Architect Principles', pct: 60, meta: 'Module 4 / 7 · resume' },
    build: { project: 'Solaris Agri-Coop', ms: 3, msTotal: 5, meta: 'Next: Solar irrigation', team: [['KP', '#3b82f6'], ['FD', '#13ec13'], ['NJ', '#FFC72C'], ['+2', 'var(--surface-dark-2)']] },
    brand: { score: 85, delta: 6 },
  },
  actions: [
    {
      hub: 'build',
      kind: 'complete_milestone',
      data: { title: 'Solar irrigation', description: 'Solaris Agri-Coop · 3/5 milestones' },
      due: null,
      urgent: true,
    },
    {
      hub: 'learn',
      kind: 'complete_module',
      data: { title: 'Cooperative Governance', description: 'Architect Principles · 60% complete' },
      due: null,
    },
    {
      hub: 'community',
      kind: 'reply_discussion',
      data: { title: '#Legal #Startup', description: '2 mentions from Kaelan P. · Lagos' },
      due: null,
    },
    {
      hub: 'brand',
      kind: 'strengthen_brand',
      data: { title: 'Strengthen your Brand Story', description: '2 missing sections · +4 impact estimated' },
      due: null,
    },
  ],
  spotlight: {
    name: 'Umoja Weavers',
    tagKey: 'featured',
    desc: 'Textile collective · natural indigo dyeing',
    place: 'Nairobi, Kenya',
    ms: 4,
    msTotal: 6,
    pct: 67,
    team: [['AO', '#FFC72C'], ['ZW', '#00796B'], ['TM', '#E57373'], ['KN', '#3b82f6'], ['+7', 'var(--surface-dark-2)']],
  },
  feed: [
    {
      av: ['KP', '#E57373'],
      hub: 'community',
      kind: 'launched_discussion',
      data: { who: 'Kaelan P.', what: 'started a discussion', detail: 'Tips to register a cooperative in Nigeria' },
      when: '2 h',
      place: 'Lagos, NG',
    },
    {
      av: ['FD', '#00796B'],
      hub: 'learn',
      kind: 'completed_module',
      data: { who: 'Fatou D.', what: 'completed the module', detail: 'Design Thinking for cooperatives' },
      when: '4 h',
      place: null,
    },
    {
      av: ['SA', '#3b82f6'],
      hub: 'build',
      kind: 'milestone_validated',
      data: { who: 'Solaris Agri-Coop', what: 'milestone validated', detail: '"Soil study" approved by 4 members' },
      when: '1 d',
      place: 'Kenya',
    },
    {
      av: ['BI', '#FFC72C'],
      hub: 'brand',
      kind: 'brand_progressed',
      data: { who: 'Brand Impact', what: 'progressed', detail: '+6 this week — resonance rising' },
      when: '1 d',
      place: null,
    },
  ],
};
