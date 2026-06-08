'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HUB_CONFIG, INITIAL_DATA } from '@/data/mockData';
import { Avatar } from './Avatar';

interface HubLayoutProps {
  hubKey: 'community' | 'learn' | 'build' | 'brand';
  children: React.ReactNode;
  tabs: [string, string | null][];
  searchPlaceholder: string;
}

export const HubLayout: React.FC<HubLayoutProps> = ({
  hubKey,
  children,
  tabs,
  searchPlaceholder,
}) => {
  const H = HUB_CONFIG[hubKey];
  const [activeTab, setActiveTab] = useState(0);
  const [data] = useState(INITIAL_DATA);

  return (
    <div className="min-h-screen w-full relative bg-[var(--bg-2)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">
        
        {/* SIDEBAR RAIL (Desktop Only) */}
        <aside className="hidden md:flex sticky top-0 h-screen p-[24px_18px] bg-[var(--bg)] border-r border-[var(--line)] flex-col gap-[6px]">
          <div className="brandmark flex items-center gap-[11px] pb-[20px] px-[8px]">
            <div className="logo w-[38px] height-[38px] rounded-[12px] bg-gradient-to-br from-[var(--primary)] to-[var(--brand-gold)] grid place-items-center text-[#1f1a17] font-bold text-[18px]">
              A
            </div>
            <div>
              <b className="text-[17px] font-bold block">ABC OS</b>
              <s className="text-[11px] text-[var(--ink-faint)] block no-underline">African Business Co-ops</s>
            </div>
          </div>
          
          <Link href="/" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link href="/community" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'community' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">groups</span>
            Community
          </Link>
          <Link href="/learn" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'learn' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">school</span>
            Learn
          </Link>
          <Link href="/build" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'build' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">construction</span>
            Build
          </Link>
          <Link href="/brand" className={`navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold ${hubKey === 'brand' ? 'on' : ''}`}>
            <span className="material-symbols-outlined">verified</span>
            Brand
          </Link>
          
          <div className="flex-1"></div>
          
          <div className="me2 flex items-center gap-[10px] p-[10px] rounded-[13px] border border-[var(--line)]">
            <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[38px] h-[38px]" />
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold truncate">{data.member.full}</div>
              <div className="text-[11px] text-[var(--ink-faint)] truncate">{data.coop}</div>
            </div>
          </div>
        </aside>

        {/* MAIN HUB AREA */}
        <main className="flex-1 pb-32">
          
          {/* Header Mobile & Desktop */}
          <div className="appbar flex items-center p-[10px_18px_6px] md:p-6 md:pb-3 border-b md:border-b-0 border-[var(--line)] bg-[var(--bg)] md:bg-transparent">
            <Link href="/" className="icbtn backbtn flex items-center justify-center tap">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div className="ml-[12px] font-bold text-[16px] md:text-lg text-[var(--ink)]">
              {H.name} Hub
            </div>
            <button className="icbtn ml-auto tap flex items-center justify-center" aria-label="Réglages">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          {/* Hub Title Info */}
          <div className="hubhead px-6 py-4">
            <div className="eyebrow font-bold text-[11px] tracking-widest text-[var(--c)]" style={{ '--c': H.c } as React.CSSProperties}>
              {H.label}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mt-1">{H.name}</h1>
          </div>

          {/* Search bar */}
          <div className="search mx-6 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-500">search</span>
            <input
              type="text"
              placeholder={`${searchPlaceholder}…`}
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

      {/* Mobile Bottom Navigation */}
      <nav className="nav md:hidden fixed left-0 right-0 bottom-0 z-[6] bg-[var(--card)]/90 backdrop-blur-md border-t border-[var(--line)] grid grid-cols-4 p-[9px_14px_env(safe-area-inset-bottom)]">
        <Link href="/community" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'community' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'community' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">groups</span>Community
        </Link>
        <Link href="/learn" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'learn' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'learn' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">school</span>Learn
        </Link>
        <Link href="/build" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'build' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'build' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">construction</span>Build
        </Link>
        <Link href="/brand" className={`tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold ${hubKey === 'brand' ? 'on font-bold' : ''}`} style={{ '--c': hubKey === 'brand' ? 'var(--primary)' : undefined } as React.CSSProperties}>
          <span className="material-symbols-outlined text-[25px]">verified</span>Brand
        </Link>
      </nav>

      {/* Mobile Floating Action Button */}
      <button 
        className="fab tap md:hidden fixed right-[18px] bottom-[92px] z-[7] w-[58px] h-[58px] rounded-[19px] text-white shadow-lg flex items-center justify-center"
        style={{ background: `linear-gradient(150deg, var(--c), color-mix(in srgb, var(--c) 75%, #000))`, '--c': H.c } as React.CSSProperties}
        aria-label="Action rapide"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>
    </div>
  );
};
