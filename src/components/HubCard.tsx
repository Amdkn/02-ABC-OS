import React from 'react';
import Link from 'next/link';
import { HUB_CONFIG } from '@/data/mockData';
import { HubPulse } from '@/types';
import { Avatar } from './Avatar';
import { SvgGauge } from './SvgGauge';

interface HubCardProps {
  hubKey: 'community' | 'learn' | 'build' | 'brand';
  pulse: HubPulse;
}

export const HubCard: React.FC<HubCardProps> = ({ hubKey, pulse }) => {
  const H = HUB_CONFIG[hubKey];
  const P = pulse[hubKey];
  
  let bodyContent = null;
  
  if (hubKey === 'community') {
    const commP = P as typeof pulse.community;
    bodyContent = (
      <>
        <div className="cnt">
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>forum</span>
          {commP.count}
        </div>
        <h3>Community</h3>
        <div className="meta">{commP.meta}</div>
        <div className="foot">
          <div className="pill" style={{ background: 'color-mix(in srgb, var(--c) 18%, transparent)', color: 'var(--c)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>event</span>
            3 events
          </div>
        </div>
      </>
    );
  } else if (hubKey === 'learn') {
    const learnP = P as typeof pulse.learn;
    bodyContent = (
      <>
        <div className="cnt">{learnP.pct}%</div>
        <h3>Learn</h3>
        <div className="meta">
          {learnP.course}
          <br />
          {learnP.meta}
        </div>
        <div className="foot">
          <div className="bar">
            <span style={{ width: `${learnP.pct}%`, background: 'var(--c)' }}></span>
          </div>
        </div>
      </>
    );
  } else if (hubKey === 'build') {
    const buildP = P as typeof pulse.build;
    bodyContent = (
      <>
        <div className="cnt">
          {buildP.ms}/{buildP.msTotal}
        </div>
        <h3>Build</h3>
        <div className="meta">
          {buildP.project}
          <br />
          {buildP.meta}
        </div>
        <div className="foot stack">
          {buildP.team.map((t, idx) => (
            <Avatar key={idx} initials={t[0]} color={t[1]} className="av" />
          ))}
        </div>
      </>
    );
  } else if (hubKey === 'brand') {
    const brandP = P as typeof pulse.brand;
    bodyContent = (
      <>
        <div className="cnt">
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>trending_up</span>
          +{brandP.delta}
        </div>
        <h3 style={{ marginBottom: '8px' }}>Brand</h3>
        <div className="foot" style={{ paddingTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SvgGauge score={brandP.score} size={64} stroke={7} />
          <div className="meta">
            Brand Impact
            <br />
            +{brandP.delta} cette semaine
          </div>
        </div>
      </>
    );
  }

  return (
    <Link href={H.href} className="hub tap" style={{ '--c': H.c } as React.CSSProperties} aria-label={`Ouvrir ${H.name}`}>
      <div className="top">
        <div className="ico">
          <span className="material-symbols-outlined">{H.ico}</span>
        </div>
        <span className="material-symbols-outlined chev" style={{ fontSize: '18px' }}>north_east</span>
      </div>
      {bodyContent}
    </Link>
  );
};
