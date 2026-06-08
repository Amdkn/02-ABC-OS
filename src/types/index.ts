export interface Member {
  name: string;
  full: string;
  initials: string;
  tint: string;
}

export interface HubPulse {
  community: {
    count: string;
    meta: string;
  };
  learn: {
    course: string;
    pct: number;
    meta: string;
  };
  build: {
    project: string;
    ms: number;
    msTotal: number;
    meta: string;
    team: [string, string][];
  };
  brand: {
    score: number;
    delta: number;
  };
}

export interface ActionItem {
  hub: 'community' | 'learn' | 'build' | 'brand';
  t: string;
  d: string;
  due: string | null;
  urgent?: boolean;
}

export interface SpotlightProject {
  name: string;
  tag: string;
  desc: string;
  place: string;
  ms: number;
  msTotal: number;
  pct: number;
  team: [string, string][];
}

export interface FeedItem {
  who: string;
  av: [string, string];
  hub: 'community' | 'learn' | 'build' | 'brand';
  what: string;
  detail: string;
  when: string;
  place: string | null;
}

export interface AppData {
  member: Member;
  coop: string;
  place: string;
  notifications: number;
  pulse: HubPulse;
  actions: ActionItem[];
  spotlight: SpotlightProject;
  feed: FeedItem[];
}
