'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HUB_CONFIG, INITIAL_DATA } from '@/data/mockData';
import { Avatar } from './Avatar';
import { useTheme } from '@/contexts/ThemeContext';

interface HubLayoutProps {
  hubKey: 'community' | 'learn' | 'build' | 'brand';
  children: React.ReactNode;
  tabs: [string, string | null][];
  searchPlaceholder: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  activeTab?: number;
  onTabChange?: (idx: number) => void;
}

export const HubLayout: React.FC<HubLayoutProps> = ({
  hubKey,
  children,
  tabs,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const tCommon = useTranslations('common');
  const tHub = useTranslations(`hubs.${hubKey}`);
  const tTheme = useTranslations('theme');
  const { theme, toggleTheme } = useTheme();
  const H = HUB_CONFIG[hubKey];
  const [localActiveTab, setLocalActiveTab] = useState(0);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [data] = useState(INITIAL_DATA);

  const isTabControlled = controlledActiveTab !== undefined;
  const activeTab = isTabControlled ? controlledActiveTab : localActiveTab;
  const setActiveTab = (idx: number) => {
    if (onTabChange) onTabChange(idx);
    if (!isTabControlled) setLocalActiveTab(idx);
  };

  const isSearchControlled = searchQuery !== undefined;
  const currentSearchQuery = isSearchControlled ? searchQuery : localSearchQuery;
  const handleSearchChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    if (!isSearchControlled) setLocalSearchQuery(val);
  };

  return (
    <div className="min-h-screen w-full relative bg-[var(--bg-2)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">

        {/* SIDEBAR RAIL (Desktop Only) */}
        <aside className="hidden md:flex sticky top-0 h-screen p-[24px_18px] bg-[var(--bg)] border-r border-[var(--line)] flex-col gap-[6px]">
          <div className="brandmark flex items-center gap-[11px] pb-[20px] px-[8px]">
            <div className="logo w-[38px] h-[38px] rounded-[12px] bg-gradient-to-br from-[var(--primary)] to-[var(--brand-gold)] grid place-items-center text-[#1f1a17] font-bold text-[18px]">
              A
            </div>
            <div>
              <b className="text-[17px] font-bold block">ABC OS</b>
              <s className="text-[11px] text-[var(--ink-faint)] block no-underline">African Business Co-ops</s>
            </div>
          </div>

          <Link href="/" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
            <span className="material-symbols-outlined">dashboard</span>
            {tCommon('dashboard')}
          </Link>
          <Link href="/community" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'community' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">groups</span>
            {tCommon('community')}
          </Link>
          <Link href="/learn" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'learn' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">school</span>
            {tCommon('learn')}
          </Link>
          <Link href="/build-hub" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'build' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">construction</span>
            {tCommon('build')}
          </Link>
          <Link href="/brand" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'brand' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">verified</span>
            {tCommon('brand')}
          </Link>

          <div className="flex-1"></div>

          {/* Profile toggle: click avatar to expand a panel with dark mode + sign-out (tour 4, 2026-06-14) */}
          <details className="profile-toggle group">
            <summary
              className="me2 tap flex items-center gap-[10px] p-[10px] rounded-[13px] border border-[var(--line)] cursor-pointer list-none [&::-webkit-details-marker]:hidden"
              aria-label={`${data.member.full} profile menu`}
            >
              <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[38px] h-[38px]" />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold truncate">{data.member.full}</div>
                <div className="text-[11px] text-[var(--ink-faint)] truncate">{data.coop}</div>
              </div>
              <span
                className="material-symbols-outlined text-[var(--ink-faint)] text-[20px] transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="profile-panel mt-[6px] p-[8px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] flex flex-col gap-[4px]">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? tTheme('switchToLight') : tTheme('switchToDark')}
                className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[11px] text-[var(--ink-soft)] text-[14px] font-semibold w-full"
              >
                <span className={`material-symbols-outlined ${theme === 'light' ? 'ms-fill' : ''}`}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                {theme === 'dark' ? tTheme('light') : tTheme('dark')}
              </button>
              <button
                type="button"
                disabled
                aria-label="Sign out (coming soon)"
                className="navitem flex items-center gap-[12px] p-[11px_12px] rounded-[11px] text-[var(--ink-faint)] text-[14px] font-semibold w-full opacity-60 cursor-not-allowed"
              >
                <span className="material-symbols-outlined">logout</span>
                Sign out
              </button>
            </div>
          </details>
        </aside>

        {/* MAIN HUB AREA — pb-40 (160px) reserves space so content never scrolls under the mobile bottom nav (D2 fix2 2026-06-14) */}
        <main className="flex-1 pb-40 md:pb-32" style={{ paddingBottom: 'max(160px, calc(80px + env(safe-area-inset-bottom)))' }}>

          {/* Header Mobile & Desktop */}
          <div className="appbar flex items-center p-[10px_18px_6px] md:p-6 md:pb-3 border-b md:border-b-0 border-[var(--line)] bg-[var(--bg)] md:bg-transparent">
            <Link href="/" aria-label="Back to Dashboard" className="icbtn backbtn flex items-center justify-center tap">
              <span className="material-symbols-outlined">home</span>
            </Link>
            <div className="ml-[12px] font-bold text-[16px] md:text-lg text-[var(--ink)]">
              {H.name} Hub
            </div>
            {/* Per A0 (2026-06-13): the + button lives INSIDE each page (Learn/Build/Brand),
                not in the layout. Pages add their own Create buttons as needed. */}
            <button className="icbtn ml-auto tap hidden md:flex items-center justify-center" aria-label="Settings">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          {/* Hub Title Info */}
          <div className="hubhead px-6 py-4">
            <div className="eyebrow font-bold text-[11px] tracking-widest text-[var(--c)]" style={{ '--c': H.c } as React.CSSProperties}>
              {tHub('eyebrow')}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mt-1">{tHub('title')}</h1>
          </div>

          {/* Search bar */}
          <div className="search mx-6 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500">search</span>
            <input
              type="text"
              placeholder={`${searchPlaceholder}…`}
              value={currentSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[var(--ink)] placeholder:text-[var(--ink-faint)]"
            />
          </div>

          {/* Segment tabs */}
          <div className="segtabs px-6 mb-6">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-[7px] ${activeTab === idx ? 'on' : ''}`}
                style={{ '--c': H.c } as React.CSSProperties}
              >
                {tab[0]}
                {tab[1] && (
                  <span className="b">
                    {tab[1]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Specific content */}
          <div className="px-6">
            {children}
          </div>

        </main>
      </div>

      {/* Mobile Bottom Navigation — 4 items only (no dark mode toggle on mobile). z-50 lifts above any future modal/toast layer (D2 fix2 2026-06-14) */}
      <nav aria-label={tCommon('ariaMainNav')} className="nav md:hidden fixed left-0 right-0 bottom-0 z-50 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--line)] grid grid-cols-4" style={{ padding: '9px 14px env(safe-area-inset-bottom)' }}>
        <Link href="/community" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'community' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'community' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">groups</span>{tCommon('community')}
        </Link>
        <Link href="/learn" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'learn' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'learn' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">school</span>{tCommon('learn')}
        </Link>
        <Link href="/build-hub" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'build' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'build' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">construction</span>{tCommon('build')}
        </Link>
        <Link href="/brand" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'brand' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'brand' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">verified</span>{tCommon('brand')}
        </Link>
      </nav>
    </div>
  );
};
