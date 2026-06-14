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

export type HubKey = 'community' | 'learn' | 'build' | 'brand';

export type ActionKind =
  | 'complete_milestone'
  | 'complete_module'
  | 'reply_discussion'
  | 'strengthen_brand';

export type FeedKind =
  | 'launched_discussion'
  | 'completed_module'
  | 'milestone_validated'
  | 'brand_progressed';

export interface ActionItem {
  hub: HubKey;
  kind: ActionKind;
  data: Record<string, string | number>;
  due: string | null;
  urgent?: boolean;
}

export interface SpotlightProject {
  name: string;
  tagKey: 'featured';
  desc: string;
  place: string;
  ms: number;
  msTotal: number;
  pct: number;
  team: [string, string][];
}

export interface FeedItem {
  av: [string, string];
  hub: HubKey;
  kind: FeedKind;
  data: Record<string, string | number>;
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
