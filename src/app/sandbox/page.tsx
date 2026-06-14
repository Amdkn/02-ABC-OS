'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { INITIAL_DATA } from '@/data/mockData';
import { HubCard } from '@/components/HubCard';
import { ActionCard } from '@/components/ActionCard';
import { Spotlight } from '@/components/Spotlight';
import { FeedCard } from '@/components/FeedCard';
import { Avatar } from '@/components/Avatar';
import { ControlDock, DeviceMode, ThemeMode, AppState } from '@/components/ControlDock';

export default function SandboxPage() {
  // /sandbox is a dev-only demo wrapper (iOS phone frame). In production, return 404.
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const tCommon = useTranslations('common');
  const tDash = useTranslations('dashboard');
  const tSandbox = useTranslations('sandbox');

  const [device, setDevice] = useState<DeviceMode>('mobile');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [appState, setAppState] = useState<AppState>('ready');
  const [data] = useState(INITIAL_DATA);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Sync body class for view-mode to replicate legacy body.view-mobile / body.view-desktop behavior
  useEffect(() => {
    document.body.className = 'view-' + device;
  }, [device]);

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
    if (hr < 12) return tDash('greetingMorning');
    if (hr < 18) return tDash('greetingAfternoon');
    return tDash('greetingEvening');
  };

  // Renders the skeleton loaders for Loading state
  const renderMobileSkeleton = () => {
    const cardSkel = (
      <div className="card" style={{ height: '156px', padding: '15px' }}>
        <div className="skel" style={{ width: '38px', height: '38px', borderRadius: '12px' }}></div>
        <div className="skel" style={{ width: '60%', height: '14px', marginTop: '14px' }}></div>
        <div className="skel" style={{ width: '85%', height: '10px', marginTop: '10px' }}></div>
        <div className="skel" style={{ width: '70%', height: '10px', marginTop: '7px' }}></div>
      </div>
    );
    const rowSkel = (
      <div className="card" style={{ height: '70px', display: 'flex', alignItems: 'center', gap: '13px', padding: '14px' }}>
        <div className="skel" style={{ width: '42px', height: '42px', borderRadius: '13px' }}></div>
        <div style={{ flex: 1 }}>
          <div className="skel" style={{ width: '80%', height: '12px' }}></div>
          <div className="skel" style={{ width: '50%', height: '10px', marginTop: '8px' }}></div>
        </div>
      </div>
    );
    return (
      <div className="sec">
        <div className="skel" style={{ width: '140px', height: '18px', marginBottom: '14px' }}></div>
        <div className="pulse">
          {cardSkel}
          {cardSkel}
          {cardSkel}
          {cardSkel}
        </div>
        <div className="skel" style={{ width: '110px', height: '18px', marginTop: '24px', marginBottom: '14px' }}></div>
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
      <div className="b-card" style={{ height: '200px' }}>
        <div className="skel" style={{ width: '40px', height: '40px', borderRadius: '12px' }}></div>
        <div className="skel" style={{ width: '60%', height: '16px', marginTop: '18px' }}></div>
        <div className="skel" style={{ width: '80%', height: '11px', marginTop: '12px' }}></div>
      </div>
    );
    const big = (
      <div className="b-card" style={{ gridColumn: 'span 2', gridRow: 'span 2', height: '416px' }}>
        <div className="skel" style={{ width: '100%', height: '140px', borderRadius: '14px' }}></div>
        <div className="skel" style={{ width: '50%', height: '18px', marginTop: '16px' }}></div>
        <div className="skel" style={{ width: '80%', height: '12px', marginTop: '10px' }}></div>
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
        <h3>{tDash('emptyTitle')}</h3>
        <p>
          {tSandbox.rich('emptyBody', {
            b: (chunks) => <b>{chunks}</b>,
            coop: data.coop,
          })}
        </p>
        <button className="btn-primary tap" onClick={handleSeed}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>group_add</span>
          {tDash('inviteMembers')}
        </button>
      </div>
    </div>
  );

  const renderMobileContent = () => {
    const syncPill = appState === 'error' ? (
      <button
        className="syncpill off tap"
        onClick={() => setAppState('ready')}
        aria-label="Synchronization status: offline"
      >
        <span className="led"></span>{tDash('syncOffline')}
      </button>
    ) : (
      <button
        className="syncpill tap"
        onClick={() => setAppState('error')}
        aria-label="Synchronization status: OK"
      >
        <span className="led"></span>{tDash('syncOk')}
      </button>
    );

    return (
      <>
        {/* App Bar */}
        <div className="appbar">
          <div className="me">
            <Avatar initials={data.member.initials} color={data.member.tint} className="av" />
            <div className="hello">
              <div className="g">{tSandbox('greetingLine', { greeting: greeting() })}</div>
              <div className="coop">
                <span className="material-symbols-outlined">hub</span>
                {data.coop}
              </div>
            </div>
          </div>
          <div className="right">
            {syncPill}
            <button className="icbtn tap" aria-label={tCommon('ariaNotifications')}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="dot-badge"></span>
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="kick">
            {tSandbox.rich('heroMobile', {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </div>
          <div className="sub">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>location_on</span>
            {data.member.full} · {data.place}
          </div>
        </div>

        {/* Error bar */}
        {appState === 'error' && (
          <div className="errbar" style={{ marginTop: '14px' }}>
            <span className="material-symbols-outlined">cloud_off</span>
            <div>
              <b>{tDash('syncFailed')}</b>
              <br />
              <span style={{ color: 'var(--ink-soft)' }}>{tDash('syncFailedCache')}</span>
            </div>
            <button onClick={handleRetry}>{tDash('retry')}</button>
          </div>
        )}

        {appState === 'loading' && renderMobileSkeleton()}
        {appState === 'empty' && renderMobileEmpty()}

        {appState !== 'loading' && appState !== 'empty' && (
          <>
            {/* Pulse Hubs */}
            <div className="sec">
              <div className="sechd">
                <h2>{tDash('pulseTitle')}</h2>
                <button className="more">
                  {tCommon('seeAll')} <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chevron_right</span>
                </button>
              </div>
              <div className="pulse">
                <HubCard hubKey="community" pulse={data.pulse} />
                <HubCard hubKey="learn" pulse={data.pulse} />
                <HubCard hubKey="build" pulse={data.pulse} />
                <HubCard hubKey="brand" pulse={data.pulse} />
              </div>
            </div>

            {/* Next Best Actions */}
            <div className="sec">
              <div className="sechd">
                <h2>{tDash('todayTitle')}</h2>
                <span
                  className="more"
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                  aria-label={`${data.actions.length} next best actions pending`}
                >
                  {tDash('todayActions', { count: data.actions.length })}
                </span>
              </div>
              <div className="actions">
                {data.actions.map((action, idx) => (
                  <ActionCard key={idx} action={action} />
                ))}
              </div>
            </div>

            {/* Spotlight */}
            <div className="sec">
              <div className="sechd">
                <h2>{tDash('spotlightTitle')}</h2>
              </div>
              <Spotlight project={data.spotlight} />
            </div>

            {/* Recent activity feed */}
            <div className="sec">
              <div className="sechd">
                <h2>{tDash('feedTitle')}</h2>
                <button className="more">{tCommon('seeAll')}</button>
              </div>
              <div className="feed">
                {data.feed.map((item, idx) => (
                  <FeedCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const renderDesktopContent = () => {
    const syncPill = appState === 'error' ? (
      <button
        className="syncpill off tap"
        onClick={() => setAppState('ready')}
        aria-label="Synchronization status: offline"
      >
        <span className="led"></span>{tDash('syncOfflineCache')}
      </button>
    ) : (
      <button
        className="syncpill tap"
        onClick={() => setAppState('error')}
        aria-label="Synchronization status: OK"
      >
        <span className="led"></span>{tDash('syncOk')}
      </button>
    );

    return (
      <>
        {/* Desktop Head */}
        <div className="deskhead">
          <div>
            <div className="kick">
              {tSandbox.rich('heroDesktop', {
                name: tDash('fallbackMemberName'),
                em: (chunks) => <em>{chunks}</em>,
              })}
            </div>
            <div className="sub">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--secondary)' }}>hub</span>
              {data.coop} · {data.place}
            </div>
          </div>
          <div className="right">
            {syncPill}
            <button className="icbtn tap" aria-label={tCommon('ariaNotifications')}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="dot-badge"></span>
            </button>
            <button className="btn-primary tap" style={{ marginTop: 0 }}>
              <span className="material-symbols-outlined">bolt</span>
              {tDash('quickAction')}
            </button>
          </div>
        </div>

        {/* Error bar */}
        {appState === 'error' && (
          <div className="errbar" style={{ margin: '0 0 18px' }}>
            <span className="material-symbols-outlined">cloud_off</span>
            <div>
              <b>{tDash('syncFailed')}</b> — {tDash('syncFailedCache')}
            </div>
            <button onClick={handleRetry}>{tDash('retry')}</button>
          </div>
        )}

        {appState === 'loading' && renderDesktopSkeleton()}
        {appState === 'empty' && (
          <div className="b-card">{renderMobileEmpty()}</div>
        )}

        {appState !== 'loading' && appState !== 'empty' && (
          <div className="bento">
            <div className="b-pulse">
              <HubCard hubKey="community" pulse={data.pulse} />
            </div>
            <div className="b-pulse">
              <HubCard hubKey="learn" pulse={data.pulse} />
            </div>
            <div className="b-spot b-card">
              <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{tDash('spotlightTitle')}</h3>
              </div>
              <Spotlight project={data.spotlight} />
            </div>
            <div className="b-actions b-card">
              <div className="hd">
                <h3>{tDash('todayTitleDesktop')}</h3>
                <span className="more" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {data.actions.length}
                </span>
              </div>
              <div className="actions">
                {data.actions.map((action, idx) => (
                  <ActionCard key={idx} action={action} />
                ))}
              </div>
            </div>
            <div className="b-pulse">
              <HubCard hubKey="build" pulse={data.pulse} />
            </div>
            <div className="b-pulse">
              <HubCard hubKey="brand" pulse={data.pulse} />
            </div>
            <div className="b-feed b-card">
              <div className="hd">
                <h3>{tDash('crossHubFeedTitle')}</h3>
                <button className="more">{tCommon('seeAll')}</button>
              </div>
              <div className="feed">
                {data.feed.map((item, idx) => (
                  <FeedCard key={idx} item={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="stage grain min-h-screen w-full flex flex-col justify-start items-center">

      {/* Back button to real dashboard */}
      <Link href="/" className="absolute top-4 left-4 z-50 bg-[var(--card)] hover:bg-neutral-800 p-2.5 rounded-lg border border-[var(--line)] flex items-center gap-1.5 text-sm text-[var(--ink)] transition-colors no-underline">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {tCommon('backToApp')}
      </Link>

      {/* ============ MOBILE FRAME PREVIEW ============ */}
      {device === 'mobile' && (
        <div className="phone-wrap py-8" data-screen-label={tSandbox('mobileFrameLabel')}>
          <div className="phone">
            <div className="screen">
              <div className="notch"></div>
              <div className="statusbar">
                <span>9:41</span>
                <span className="icons">
                  <span className="material-symbols-outlined">signal_cellular_alt</span>
                  <span className="material-symbols-outlined">wifi</span>
                  <span className="material-symbols-outlined">battery_full</span>
                </span>
              </div>

              <div className="scroll noscroll">
                {renderMobileContent()}
              </div>

              <button className="fab tap" id="m-fab" aria-label={tDash('quickAction')}>
                <span className="material-symbols-outlined">add</span>
              </button>

              <nav className="nav" aria-label={tCommon('ariaMainNav')}>
                <Link href="/community" className="tap"><span className="material-symbols-outlined">groups</span>{tCommon('community')}</Link>
                <Link href="/learn" className="tap"><span className="material-symbols-outlined">school</span>{tCommon('learn')}</Link>
                <Link href="/build-hub" className="tap"><span className="material-symbols-outlined">construction</span>{tCommon('build')}</Link>
                <Link href="/brand" className="tap"><span className="material-symbols-outlined">verified</span>{tCommon('brand')}</Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* ============ DESKTOP PREVIEW ============ */}
      {device === 'desktop' && (
        <div className="desk w-full max-w-[1440px] pt-12" data-screen-label={tSandbox('desktopFrameLabel')}>
          <div className="deskgrid">
            <aside className="rail">
              <div className="brandmark">
                <div className="logo">A</div>
                <div>
                  <b>ABC OS</b>
                  <s>{tSandbox('brandSlogan')}</s>
                </div>
              </div>
              <a className="navitem on tap"><span className="material-symbols-outlined">dashboard</span>{tCommon('dashboard')}</a>
              <Link href="/community" className="navitem tap"><span className="material-symbols-outlined">groups</span>{tCommon('community')}</Link>
              <Link href="/learn" className="navitem tap"><span className="material-symbols-outlined">school</span>{tCommon('learn')}</Link>
              <Link href="/build-hub" className="navitem tap"><span className="material-symbols-outlined">construction</span>{tCommon('build')}</Link>
              <Link href="/brand" className="navitem tap"><span className="material-symbols-outlined">verified</span>{tCommon('brand')}</Link>

              <div className="spacer"></div>

              <div className="me2">
                <div className="avatar av" style={{ background: 'linear-gradient(150deg,#FFC72C,#E57373)' }}>AO</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700 }}>Amara Okonkwo</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>Umoja Weavers · Nairobi</div>
                </div>
              </div>
            </aside>
            <main className="deskmain">
              {renderDesktopContent()}
            </main>
          </div>
        </div>
      )}

      {/* ============ CONTROL DOCK ============ */}
      <ControlDock
        device={device}
        setDevice={setDevice}
        theme={theme}
        setTheme={setTheme}
        appState={appState}
        setAppState={setAppState}
      />
    </div>
  );
}
