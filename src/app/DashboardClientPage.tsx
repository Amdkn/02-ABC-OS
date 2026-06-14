'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { HubCard } from '@/components/HubCard';
import { ActionCard } from '@/components/ActionCard';
import { Spotlight } from '@/components/Spotlight';
import { FeedCard } from '@/components/FeedCard';
import { Avatar } from '@/components/Avatar';
import { AppState } from '@/components/ControlDock';
import { useTheme } from '@/contexts/ThemeContext';
import { AppData } from '@/types';

interface DashboardClientPageProps {
  initialData: AppData;
}

export default function DashboardClientPage({
  initialData,
}: DashboardClientPageProps) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tTheme = useTranslations('theme');
  const { theme, toggleTheme } = useTheme();

  const [appState, setAppState] = useState<AppState>('ready');
  const [data] = useState(initialData);

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

  const greeting = (): string => {
    const hr = new Date().getHours();
    if (hr < 12) return t('greetingMorning');
    if (hr < 18) return t('greetingAfternoon');
    return t('greetingEvening');
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
        <h3>{t('emptyTitle')}</h3>
        <p>
          {t.rich('emptyBody', {
            b: (chunks) => <b>{chunks}</b>,
            coop: data.coop,
          })}
        </p>
        <button className="btn-primary tap" onClick={handleSeed}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>group_add</span>
          {t('inviteMembers')}
        </button>
      </div>
    </div>
  );

  // Build translated pulse for HubCard consumption (HubCard uses raw keys)
  const translatedPulse = {
    community: {
      count: data.pulse.community.count, // dynamic from DB, leave as-is
      meta: data.pulse.community.meta,
    },
    learn: {
      course: data.pulse.learn.course,
      pct: data.pulse.learn.pct,
      meta: data.pulse.learn.meta,
    },
    build: {
      project: data.pulse.build.project,
      ms: data.pulse.build.ms,
      msTotal: data.pulse.build.msTotal,
      meta: data.pulse.build.meta,
      team: data.pulse.build.team,
    },
    brand: {
      score: data.pulse.brand.score,
      delta: data.pulse.brand.delta,
    },
  };

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
              {tCommon('dashboard')}
            </Link>
            <Link href="/community" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">groups</span>
              {tCommon('community')}
            </Link>
            <Link href="/learn" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">school</span>
              {tCommon('learn')}
            </Link>
            <Link href="/build-hub" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">construction</span>
              {tCommon('build')}
            </Link>
            <Link href="/brand" className="navitem tap flex items-center gap-[12px] p-[11px_12px] rounded-[13px] text-[var(--ink-soft)] text-[14.5px] font-semibold">
              <span className="material-symbols-outlined">verified</span>
              {tCommon('brand')}
            </Link>

            <div className="flex-1"></div>

            {/* Profile toggle: click avatar to expand panel with dark mode + sign-out (tour 4, 2026-06-14) */}
            <details className="profile-toggle group">
              <summary
                className="me2 tap flex items-center gap-[10px] p-[10px] rounded-[13px] border border-[var(--line)] cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                aria-label={`${data.member.full} profile menu`}
              >
                <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[38px] h-[38px] text-[14px]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold truncate">{data.member.full}</div>
                  <div className="text-[11px] text-[var(--ink-faint)] truncate">{data.coop} · {data.place.split(',')[0]}</div>
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

          {/* MAIN CONTAINER */}
          <div className="flex-1 bg-[var(--bg-2)] relative">

            {/* CONTENT AREA FOR MOBILE VIEW */}
            <div className="block md:hidden">
              <div className="appbar flex items-center justify-between p-[12px_20px_8px] relative z-10">
                <div className="me flex items-center gap-[11px] min-w-0">
                  <Avatar initials={data.member.initials} color={data.member.tint} className="av w-[42px] h-[42px] text-[15px]" />
                  <div className="hello min-w-0">
                    <div className="g text-[12px] text-[var(--ink-soft)] font-medium leading-none mb-1">
                      {greeting()}{t('welcomeBack')}
                    </div>
                    <div className="coop text-[15px] font-bold flex items-center gap-[5px] leading-tight text-[var(--ink)]">
                      <span className="material-symbols-outlined text-[15px] text-[var(--secondary)]">hub</span>
                      {data.coop}
                    </div>
                  </div>
                </div>
                <div className="right flex items-center gap-[8px]">
                  {/* Bug 17: live region wrapping the sync pill so screen readers
                      announce "Synced" / "Offline cache" state changes (D1 receipt). */}
                  <div role="alert" aria-live="polite" className="contents">
                    <button
                      onClick={() => setAppState(appState === 'error' ? 'ready' : 'error')}
                      aria-label="Synchronization status: OK"
                      className={`syncpill tap flex items-center gap-[7px] h-[40px] px-[13px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] text-[12.5px] font-semibold ${appState === 'error' ? 'off' : ''}`}
                    >
                      <span className="led w-[8px] h-[8px] rounded-full bg-[var(--ok)]"></span>
                      {appState === 'error' ? t('syncOffline') : t('syncOk')}
                    </button>
                  </div>
                  <button className="icbtn tap w-[40px] h-[40px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] flex items-center justify-center relative" aria-label={tCommon('ariaNotifications')}>
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="dot-badge"></span>
                  </button>
                </div>
              </div>

              <div className="hero px-[20px] py-[8px] z-10">
                <div className="kick font-fraunces italic font-semibold text-[27px] leading-tight text-[var(--ink)]">
                  {t('heroKicker')}<em>{t('heroKickerEm')}</em>{t('heroKickerCont')}
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
                    <b>{t('syncFailed')}</b>
                    <br />
                    <span className="text-[var(--ink-soft)]">{t('syncFailedCache')}</span>
                  </div>
                  <button className="ml-auto bg-[var(--danger)] text-white px-3 py-1.5 rounded-lg text-[12.5px] font-semibold" onClick={handleRetry}>
                    {t('retry')}
                  </button>
                </div>
              )}

              {appState !== 'loading' && appState !== 'empty' && (
                <div className="pb-32">
                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">{t('pulseTitle')}</h2>
                      <button className="more text-[12.5px] font-semibold text-[var(--ink-soft)] flex items-center gap-[2px]">
                        {tCommon('seeAll')}
                        <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                      </button>
                    </div>
                    <div className="pulse grid grid-cols-2 gap-[12px]">
                      <HubCard hubKey="community" pulse={translatedPulse} />
                      <HubCard hubKey="learn" pulse={translatedPulse} />
                      <HubCard hubKey="build" pulse={translatedPulse} />
                      <HubCard hubKey="brand" pulse={translatedPulse} />
                    </div>
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">{t('todayTitle')}</h2>
                      <span
                        className="more text-[12.5px] font-bold text-[var(--primary)]"
                        aria-label={`${data.actions.length} next best actions pending`}
                      >
                        {t('todayActions', { count: data.actions.length })}
                      </span>
                    </div>
                    <div className="actions flex flex-col gap-[9px]">
                      {data.actions.map((act, idx) => (
                        <ActionCard key={idx} action={act} />
                      ))}
                    </div>
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd">
                      <h2 className="text-[18px] font-bold mb-[12px]">{t('spotlightTitle')}</h2>
                    </div>
                    <Spotlight project={data.spotlight} />
                  </div>

                  <div className="sec px-[20px] mt-[22px]">
                    <div className="sechd flex items-baseline justify-between mb-[12px]">
                      <h2 className="text-[18px] font-bold">{t('feedTitle')}</h2>
                      <button className="more text-[12.5px] font-semibold text-[var(--ink-soft)]">{tCommon('seeAll')}</button>
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
              <nav className="nav fixed left-0 right-0 bottom-0 z-[6] bg-[var(--card)]/90 backdrop-blur-md border-t border-[var(--line)] grid grid-cols-5 p-[9px_14px_env(safe-area-inset-bottom)]" aria-label={tCommon('ariaMainNav')}>
                <Link href="/community" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">groups</span>{tCommon('community')}
                </Link>
                <Link href="/learn" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">school</span>{tCommon('learn')}
                </Link>
                <Link href="/build-hub" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">construction</span>{tCommon('build')}
                </Link>
                <Link href="/brand" className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold">
                  <span className="material-symbols-outlined text-[25px]">verified</span>{tCommon('brand')}
                </Link>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? tTheme('switchToLight') : tTheme('switchToDark')}
                  className="tap flex flex-col items-center gap-[3px] py-[6px] text-[var(--ink-faint)] text-[10.5px] font-semibold"
                >
                  <span className={`material-symbols-outlined text-[25px] ${theme === 'light' ? 'ms-fill' : ''}`}>
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                  {theme === 'dark' ? tTheme('light') : tTheme('dark')}
                </button>
              </nav>

              <button className="fab tap fixed right-[18px] bottom-[92px] z-[7] w-[58px] h-[58px] rounded-[19px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] text-white shadow-lg flex items-center justify-center" aria-label={tCommon('ariaQuickAction')}>
                <span className="material-symbols-outlined text-[28px]">add</span>
              </button>
            </div>

            {/* CONTENT AREA FOR DESKTOP VIEW */}
            <div className="hidden md:block deskmain p-[28px_32px_48px] max-w-[1280px] w-full">
              <div className="deskhead flex items-end gap-[20px] mb-[24px]">
                <div>
                  <div className="kick font-fraunces italic font-semibold text-[38px] leading-none text-[var(--ink)]">
                    {t('heroDesktopPart1', { greeting: greeting(), name: data.member.name })}<br />
                    {t('heroDesktopPart2')}<em>{t('heroDesktopPart2Em')}</em>{t('heroDesktopPart2Cont')}
                  </div>
                  <div className="sub mt-[8px] text-[14px] text-[var(--ink-soft)] flex items-center gap-[9px]">
                    <span className="material-symbols-outlined text-[18px] text-[var(--secondary)]">hub</span>
                    {data.coop} · {data.place}
                  </div>
                </div>
                <div className="right ml-auto flex items-center gap-[10px]">
                  {/* Bug 17: live region wrapping the desktop sync pill so screen
                      readers announce "Synced" / "Offline cache" state changes. */}
                  <div role="alert" aria-live="polite" className="contents">
                    <button
                      onClick={() => setAppState(appState === 'error' ? 'ready' : 'error')}
                      aria-label="Synchronization status: OK"
                      className={`syncpill tap flex items-center gap-[7px] h-[40px] px-[13px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] text-[12.5px] font-semibold ${appState === 'error' ? 'off' : ''}`}
                    >
                      <span className="led w-[8px] h-[8px] rounded-full bg-[var(--ok)]"></span>
                      {appState === 'error' ? t('syncOfflineCache') : t('syncOk')}
                    </button>
                  </div>
                  <button className="icbtn tap w-[40px] h-[40px] rounded-[13px] border border-[var(--line)] bg-[var(--card)] flex items-center justify-center relative" aria-label={tCommon('ariaNotifications')}>
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="dot-badge"></span>
                  </button>
                  <button className="btn-primary tap flex items-center gap-[7px] bg-[var(--primary)] text-white font-semibold text-[14px] p-[12px_20px] rounded-[14px] shadow-md">
                    <span className="material-symbols-outlined">bolt</span>
                    {t('quickAction')}
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
                    <b>{t('syncFailed')}</b> — {t('syncFailedCache')}
                  </div>
                  <button className="ml-auto bg-[var(--danger)] text-white px-3 py-1.5 rounded-lg text-[12.5px] font-semibold" onClick={handleRetry}>
                    {t('retry')}
                  </button>
                </div>
              )}

              {appState !== 'loading' && appState !== 'empty' && (
                <div className="bento grid grid-cols-4 gap-[16px]">
                  <div className="b-pulse">
                    <HubCard hubKey="community" pulse={translatedPulse} />
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="learn" pulse={translatedPulse} />
                  </div>
                  <div className="b-spot col-span-2 row-span-2 b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px]">
                    <div className="mb-[14px] flex items-center justify-between">
                      <h3 className="m-0 text-[16px] font-bold text-[var(--ink)]">{t('spotlightTitle')}</h3>
                    </div>
                    <Spotlight project={data.spotlight} />
                  </div>
                  <div className="b-actions b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px] col-span-2 row-span-2">
                    <div className="hd flex items-center justify-between mb-[14px]">
                      <h3 className="text-[16px] font-bold text-[var(--ink)]">{t('todayTitleDesktop')}</h3>
                      <span className="more text-[12.5px] font-bold text-[var(--primary)]">{data.actions.length}</span>
                    </div>
                    <div className="actions flex flex-col gap-[9px]">
                      {data.actions.map((act, idx) => (
                        <ActionCard key={idx} action={act} />
                      ))}
                    </div>
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="build" pulse={translatedPulse} />
                  </div>
                  <div className="b-pulse">
                    <HubCard hubKey="brand" pulse={translatedPulse} />
                  </div>
                  <div className="b-feed b-card bg-[var(--card)] border border-[var(--line)] rounded-[20px] p-[18px] col-span-2">
                    <div className="hd flex items-center justify-between mb-[14px]">
                      <h3 className="text-[16px] font-bold text-[var(--ink)]">{t('crossHubFeedTitle')}</h3>
                      <button className="more text-[12.5px] font-semibold text-[var(--primary)]">{tCommon('seeAll')}</button>
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

            {/* Preview Settings dock removed (tour 4, 2026-06-14) */}

          </div>
        </div>
      </div>
    </div>
  );
}
