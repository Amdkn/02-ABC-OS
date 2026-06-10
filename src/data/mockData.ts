import { AppData } from '@/types';

export const HUB_CONFIG = {
  community: { c: 'var(--community)', ico: 'groups', label: "L'ASSEMBLÉE", name: 'Community', href: '/community' },
  learn: { c: 'var(--learn-green)', ico: 'school', label: 'CULTIVER LE SAVOIR', name: 'Learn', href: '/learn' },
  build: { c: 'var(--build-blue)', ico: 'construction', label: 'BÂTIR ENSEMBLE', name: 'Build', href: '/build-hub' },
  brand: { c: 'var(--brand-gold)', ico: 'verified', label: 'VOTRE IDENTITÉ COLLECTIVE', name: 'Brand', href: '/brand' },
};

export const INITIAL_DATA: AppData = {
  member: { name: 'Amara', full: 'Amara Okonkwo', initials: 'AO', tint: 'linear-gradient(150deg,#FFC72C,#E57373)' },
  coop: 'Umoja Weavers',
  place: 'Nairobi, Kenya',
  notifications: 4,
  pulse: {
    community: { count: '5 nouvelles', meta: '3 événements à venir · #Legal #Startup actifs' },
    learn: { course: 'Architect Principles', pct: 60, meta: 'Module 4 / 7 · reprendre' },
    build: { project: 'Solaris Agri-Coop', ms: 3, msTotal: 5, meta: 'Prochain : Irrigation solaire', team: [['KP', '#3b82f6'], ['FD', '#13ec13'], ['NJ', '#FFC72C'], ['+2', 'var(--surface-dark-2)']] },
    brand: { score: 85, delta: 6 },
  },
  actions: [
    { hub: 'build', t: 'Finaliser le milestone « Irrigation solaire »', d: 'Solaris Agri-Coop · 3/5 jalons', due: 'Demain', urgent: true },
    { hub: 'learn', t: 'Terminer le module « Gouvernance coopérative »', d: 'Architect Principles · 60% complété', due: '12 min' },
    { hub: 'community', t: 'Répondre à la discussion #Legal #Startup', d: '2 mentions de Kaelan P. · Lagos', due: null },
    { hub: 'brand', t: 'Renforcer votre Brand Story', d: '2 sections manquantes · +4 impact estimé', due: null },
  ],
  spotlight: {
    name: 'Umoja Weavers', tag: 'PROJET VEDETTE',
    desc: 'Collectif textile · teinture naturelle indigo', place: 'Nairobi, Kenya',
    ms: 4, msTotal: 6, pct: 67,
    team: [['AO', '#FFC72C'], ['ZW', '#00796B'], ['TM', '#E57373'], ['KN', '#3b82f6'], ['+7', 'var(--surface-dark-2)']],
  },
  feed: [
    { who: 'Kaelan P.', av: ['KP', '#E57373'], hub: 'community', what: 'a lancé une discussion', detail: 'Conseils pour enregistrer une coopérative au Nigéria', when: '2 h', place: 'Lagos, NG' },
    { who: 'Fatou D.', av: ['FD', '#00796B'], hub: 'learn', what: 'a terminé le module', detail: 'Design Thinking pour coopératives', when: '4 h', place: null },
    { who: 'Solaris Agri-Coop', av: ['SA', '#3b82f6'], hub: 'build', what: 'jalon validé', detail: '« Étude de sol » approuvée par 4 membres', when: 'hier', place: 'Kenya' },
    { who: 'Brand Impact', av: ['BI', '#FFC72C'], hub: 'brand', what: 'a progressé', detail: '+6 cette semaine — résonance en hausse', when: 'hier', place: null },
  ],
};
