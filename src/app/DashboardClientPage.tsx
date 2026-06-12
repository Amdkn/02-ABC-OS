'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HubCard } from '@/components/HubCard';
import { ActionCard } from '@/components/ActionCard';
import { Spotlight } from '@/components/Spotlight';
import { FeedCard } from '@/components/FeedCard';
import { Avatar } from '@/components/Avatar';
import { AppState } from '@/components/ControlDock';
import { AppData } from '@/types';

interface DashboardClientPageProps {
  initialData: AppData;
}

export default function DashboardClientPage({
  initialData,
}: DashboardClientPageProps) {
  const [appState, setAppState] = useState<AppState>('ready');
  const [data] = useState(initialData);
  const [isThemeDark, setIsThemeDark] = useState(true);

  // Sync dark class on document element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isThemeDark);
  }, [isThemeDark]);

  const handleRetry = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState('ready');
    }, 1400);
  };

  const handleSeed = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState('ready');
    }, 1200);
  };

  const greeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Bonjour';
    if (hr < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const renderMobileSkeleton = () => {
    const cardSkel = (
      <div className="card animate-pulse" style={{ height: '156px', padding: '15px' }}>
        <div className="skel" style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '60%', height: '14px', marginTop: '14px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '85%', height: '10px', marginTop: '10px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '70%', height: '10px', marginTop: '7px', background: 'var(--line)' }}></div>
      </div>
    );
    const rowSkel = (
      <div className="card animate-pulse" style={{ height: '70px', display: 'flex', alignItems: 'center', gap: '13px', padding: '14px' }}>
        <div className="skel" style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'var(--line)' }}></div>
        <div style={{ flex: 1 }}>
          <div className="skel" style={{ width: '80%', height: '12px', background: 'var(--line)' }}></div>
          <div className="skel" style={{ width: '50%', height: '10px', marginTop: '8px', background: 'var(--line)' }}></div>
        </div>
      </div>
    );
    return (
      <div className="sec">
        <div className="skel animate-pulse" style={{ width: '140px', height: '18px', marginBottom: '14px', background: 'var(--line)' }}></div>
        <div className="pulse">
          {cardSkel}
          {cardSkel}
          {cardSkel}
          {cardSkel}
        </div>
        <div className="skel animate-pulse" style={{ width: '110px', height: '18px', marginTop: '24px', marginBottom: '14px', background: 'var(--line)' }}></div>
        <div className="actions">
          {rowSkel}
          {rowSkel}
          {rowSkel}
        </div>
      </div>
    );
  };

  const renderDesktopSkeleton = () => {
    const c = (
      <div className="b-card animate-pulse" style={{ height: '200px' }}>
        <div className="skel" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '60%', height: '16px', marginTop: '18px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '80%', height: '11px', marginTop: '12px', background: 'var(--line)' }}></div>
      </div>
    );
    const big = (
      <div className="b-card animate-pulse" style={{ gridColumn: 'span 2', gridRow: 'span 2', height: '416px' }}>
        <div className="skel" style={{ width: '100%', height: '140px', borderRadius: '14px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '50%', height: '18px', marginTop: '16px', background: 'var(--line)' }}></div>
        <div className="skel" style={{ width: '80%', height: '12px', marginTop: '10px', background: 'var(--line)' }}></div>
      </div>
    );
    return (
      <div className="bento">
        {c}
        {c}
        {big}
        {big}
        {c}
        {c}
      </div>
    );
  };

  const renderMobileEmpty = () => (
    <div className="sec">
      <div className="placeholder card">
        <div className="big">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <h3>Bienvenue dans ABC OS</h3>
        <p>Votre coopérative <b>{data.coop}</b> démarre. Invitez vos membres et lancez votre premier projet pour faire vibrer les 4 hubs.</p>
        <button className="btn-primary tap" onClick={handleSeed}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>group_add</span>
          Inviter des membres
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative">
      <div className="w-full min-h-screen">
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
            
            <Link href="/" className="navitem on tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
            <Link href="/community" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">groups</span>
              Community
            </Link>
            <Link href="/learn" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">school</span>
              Learn
            </Link>
            <Link href="/build-hub" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">construction</span>
              Build
            </Link>
            <Link href="/brand" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">verified</span>
              Brand
            </Link>
            
            <div className="flex-1"></div>
            
            <div className="me2 flex items-center gap-[10px] p-[10px] rounded-[13px] border border-[var(--line)]">
              <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[38px] h-[38px] text-[14px]" />
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold truncate">{data.member.full}</div>
                <div className="text-[11px] text-[var(--ink-faint)] truncate">{data.coop} · {data.place.split(',')[0]}</div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTAINER */}
          <div className="flex-1 bg-[var(--bg-2)] relative">
            
            {/* CONTENT AREA FOR MOBILE VIEW */}
            <div className="block md:hidden">
              <div className="appbar flex items-center justify-between p-[12px_20px_8px] relative z-10">
                <div className="me flex items-center gap-[11px] min-w-0">
                  <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[42px] h-[42px] text-[15px]" />
                  <div className="hello min-w-0">
                    <div className="g text-[12px] text-[var(--ink-soft)] font-medium leading-none mb-1">{greeting()}, bon retour</div>
                    <div className="coop text-[15px] font-bold flex items-center gap-[5px] leading-tight text-[var(--ink)]">
                      <span className="material-symbols-outlined text-[15px] text-[var(--secondary)]">hub</span>
                      {data.coop}
                    </div>
                  </div>
                </div>
                <div className="right flex items-center gap-[8px]">
                  <button 
                    onClick={() => setAppState(appState === 'error' ? 'ready' : 'error')}
                    className={`syncpill tap flex items-center gap-[7px] h-[40px] px-[13px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] text-[12.5px] font-semibold ${appState === 'error' ? 'off' : ''}`}
                  >
                    <span className="led w-[8px] h-[8px] rounded-full bg-[var(--ok)]"></span>
                    {appState === 'error' ? 'Hors-ligne' : 'Synchro'}
                  </button>
                  <button className="icbtn tap w-[40px] h-[40px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] flex items-center justify-center relative" aria-label="Notifications">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="dot-badge"></span>
                  </button>
                </div>
              </div>

              <div className="hero px-[20px] py-[8px] z-10">
                <div className="kick font-fraunces italic font-semibold text-[27px] leading-tight text-[var(--ink)]">
                  L'OS <em>en main</em>,<br />tout le temps.
                </div>
                <div className="sub mt-[6px] text-[13px] text-[var(--ink-soft)] flex items-center gap-[7px]">
                  <span className="material-symbols-outlined text-[16px] text-[var(--secondary)]">location_on</span>
                  {data.member.full} · {data.place}
                </div>
              </div>

              {appState === 'loading' && renderMobileSkeleton()}
              {appState === 'empty' && renderMobileEmpty()}

              {appState === 'error' && (
                <div className="errbar mx-[20px] my-[14px] p-[12px_14px] rounded-[14px] bg-red-900/10 border border-red-500/30 flex items-center gap-[11px] text-[13px]">
                  <span className="material-symbols-outlined text-[22px] text-[var(--danger)]">cloud_off</span>
                  <div>
                    <b>Synchronisation échouée</b>
                    <br />
                    <span className="text-[var(--ink-soft)]">Données du cache · 2 modifications en attente</span>
                  </div>
                  <button className="ml-auto bg-[var(--danger)] text-white px-3 py-1.5 rounded-lg text-[12.5px] font-semibold" onClick={handleRetry}>
                    Réessayer
                  </button>
                </div>
              )}

              {appState !== 'loading' && appState !== 'empty' && (
                <div className="pb-32">
                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">Pulse des hubs</h2>
                      <button className="more text-[12.5px] font-semibold text-[var(--ink-soft)] flex items-center gap-[2px]">
                        Tout voir
                        <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                      </button>
                    </div>
                    <div className="pulse grid grid-cols-2 gap-[12px]">
                      <HubCard hubKey="community" pulse={data.pulse} />
                      <HubCard hubKey="learn" pulse={data.pulse} />
                      <HubCard hubKey="build" pulse={data.pulse} />
                      <HubCard hubKey="brand" pulse={data.pulse} />
                    </div>
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">Aujourd'hui</h2>
                      <span className="more text-[12.5px] font-bold text-[var(--primary)]">{data.actions.length} actions</span>
                    </div>
                    <div className="actions flex flex-col gap-[9px]">
                      {data.actions.map((act, idx) => (
                        <ActionCard key={idx} action={act} />
                      ))}
                    </div>
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd">
                      <h2 className="text-[18px] font-bold mb-[12px]">Spotlight coopérative</h2>
                    </div>
                    <Spotlight project={data.spotlight} />
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">Activité récente</h2>
                      <button className="more text-[12.5px] font-semibold text-[var(--ink-soft)]">Tout voir</button>
                    </div>
                    <div className="feed flex flex-col gap-[2px]">
                      {data.feed.map((item, idx) => (
                        <FeedCard key={idx} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile bottom nav bar */}
              <nav className="nav fixed left-0 right-0 bottom-0 z-[6] bg-[var(--card)]/90 backdrop-blur-md border-t border-[var(--line)] grid grid-cols-4 p-[9px_14px_env(safe-area-inset-bottom)]" aria-label="Navigation principale">
                <Link href="/community" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">groups</span>Community
                </Link>
                <Link href="/learn" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">school</span>Learn
                </Link>
                <Link href="/build-hub" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">construction</span>Build
                </Link>
                <Link href="/brand" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">verified</span>Brand
                </Link>
              </nav>

              <button className="fab tap fixed right-[18px] bottom-[92px] z-[7] w-[58px] h-[58px] rounded-[19px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] text-white shadow-lg flex items-center justify-center" aria-label="Action rapide">
                <span className="material-symbols-outlined text-[28px]">add</span>
              </button>
            </div>

            {/* CONTENT AREA FOR DESKTOP VIEW */}
            <div className="hidden md:block deskmain p-[28px_32px_48px] max-w-[1280px] w-full">
              <div className="deskhead flex items-end gap-[20px] mb-[24px]">
                <div>
                  <div className="kick font-fraunces italic font-semibold text-[38px] leading-none text-[var(--ink)]">
                    {greeting()} {data.member.name},<br />l'OS <em>en main</em>.
                  </div>
                  <div className="sub mt-[8px] text-[14px] text-[var(--ink-soft)] flex items-center gap-[9px]">
                    <span className="material-symbols-outlined text-[18px] text-[var(--secondary)]">hub</span>
                    {data.coop} · {data.place}
                  </div>
                </div>
                <div className="right ml-auto flex items-center gap-[10px]">
                  <button 
                    onClick={() => setAppState(appState === 'error' ? 'ready' : 'error')}
                    className={`syncpill tap flex items-center gap-[7px] h-[40px] px-[13px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] text-[12.5px] font-semibold ${appState === 'error' ? 'off' : ''}`}
                  >
                    <span className="led w-[8px] h-[8px] rounded-full bg-[var(--ok)]"></span>
                    {appState === 'error' ? 'Hors-ligne · cache' : 'Synchronisé'}
                  </button>
                  <button className="icbtn tap w-[40px] h-[40px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] flex items-center justify-center relative" aria-label="Notifications">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="dot-badge"></span>
                  </button>
                  <button className="btn-primary tap flex items-center gap-[7px] bg-[var(--primary)] text-white font-semibold text-[14px] p-[12px_20px] rounded-[14px] shadow-md">
                    <span className="material-symbols-outlined">bolt</span>
                    Action rapide
                  </button>
                </div>
              </div>

              {appState === 'loading' && renderDesktopSkeleton()}
              
              {appState === 'empty' && (
                <div className="b-card p-[18px] bg-[var(--card)] border border-[var(--line)] rounded-[20px]">
                  {renderMobileEmpty()}
                </div>
              )}

              {appState === 'error' && (
                <div className="errbar p-[12px_14px] rounded-[14px] bg-red-900/10 border border-red-500/30 flex items-center gap-[11px] text-[13px] mb-[18px]">
                  <span className="material-symbols-outlined text-[22px] text-[var(--danger)]">cloud_off</span>
                  <div>
                    <b>Synchronisation échouée</b> — données du cache · 2 modifications en attente
                  </div>
                  <button className="ml-auto bg-[var(--danger)] text-white px-3 py-1.5 rounded-lg text-[12.5px] font-semibold" onClick={handleRetry}>
                    Réessayer
                  </button>
                </div>
              )}

              {appState !== 'loading' && appState !== 'empty' && (
                <div className="bento grid grid-cols-4 gap-[16px]">
                  <div className="b-pulse">
                    <HubCard hubKey="community" pulse={data.pulse} />
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="learn" pulse={data.pulse} />
                  </div>
                  <div className="b-spot col-span-2 row-span-2 b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px]">
                    <div className="mb-[14px] flex items-center justify-between">
                      <h3 className="m-0 text-[16px] font-bold text-[var(--ink)]">Spotlight coopérative</h3>
                    </div>
                    <Spotlight project={data.spotlight} />
                  </div>
                  <div className="b-actions b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px] col-span-2 row-span-2">
                    <div className="hd flex items-center justify-between mb-[14px]">
                      <h3 className="text-[16px] font-bold text-[var(--ink)]">Aujourd'hui · Next best action</h3>
                      <span className="more text-[12.5px] font-bold text-[var(--primary)]">{data.actions.length}</span>
                    </div>
                    <div className="actions flex flex-col gap-[9px]">
                      {data.actions.map((act, idx) => (
                        <ActionCard key={idx} action={act} />
                      ))}
                    </div>
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="build" pulse={data.pulse} />
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="brand" pulse={data.pulse} />
                  </div>
                  <div className="b-feed b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px] col-span-2">
                    <div className="hd flex items-center justify-between mb-[14px]">
                      <h3 className="text-[16px] font-bold text-[var(--ink)]">Activité cross-hub</h3>
                      <button className="more text-[12.5px] font-semibold text-[var(--primary)]">Tout voir</button>
                    </div>
                    <div className="feed flex flex-col gap-[2px]">
                      {data.feed.map((item, idx) => (
                        <FeedCard key={idx} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PREVIEW DOCK (Simulateur / Sandbox controls) */}
            <div className="fixed bottom-6 right-6 z-50 flex gap-3 bg-[var(--bg-dark)]/90 backdrop-blur-md p-3 border border-[var(--line)] rounded-xl shadow-2xl items-center text-white">
              <span className="text-[10px] uppercase font-bold text-[var(--primary)] tracking-wider px-2">Preview Settings</span>
              <button
                onClick={() => setIsThemeDark(!isThemeDark)}
                className="bg-[var(--card)] hover:bg-neutral-700/50 p-2 rounded-lg text-sm border border-[var(--line)] transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">{isThemeDark ? 'light_mode' : 'dark_mode'}</span>
                {isThemeDark ? 'Clair' : 'Sombre'}
              </button>
              {process.env.NODE_ENV !== 'production' && (
                <Link
                  href="/sandbox"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-deep)] text-[#1f1a17] font-bold px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  Sandbox (iOS Shell)
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
