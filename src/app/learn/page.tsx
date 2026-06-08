'use client';

import React from 'react';
import { HubLayout } from '@/components/HubLayout';

export default function LearnHubPage() {
  const tabs: [string, string | null][] = [
    ['Mes cours', null],
    ['Parcours', null],
    ['Certificats', null],
  ];

  return (
    <HubLayout
      hubKey="learn"
      tabs={tabs}
      searchPlaceholder="Rechercher cours & sujets"
    >
      <div className="hsec px-0">
        <div className="hd flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Mes cours</h2>
          <button className="more text-sm font-semibold text-[var(--c)]" style={{ '--c': 'var(--learn-green)' } as React.CSSProperties}>Tout voir</button>
        </div>

        {/* Big Course Card */}
        <div className="bigcourse mb-4">
          <div className="ph" style={{ '--c': 'var(--learn-green)' } as React.CSSProperties}>
            <span className="material-symbols-outlined">layers</span>
          </div>
          <div className="bd">
            <div className="eyebrow" style={{ color: 'var(--learn-green)' }}>
              FONDATIONS
            </div>
            <h3 style={{ margin: '6px 0 12px', fontSize: '20px', fontWeight: 700 }}>Architect Principles</h3>
            <div className="bar">
              <span style={{ width: '60%', background: 'var(--learn-green)' }}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
              <span>Module 4 / 7</span>
              <b style={{ color: 'var(--learn-green)' }}>60%</b>
            </div>
          </div>
        </div>

        {/* Course Card 2 */}
        <div className="hcard flex items-center gap-3">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in srgb, var(--learn-green) 18%, transparent)',
              color: 'var(--learn-green)',
            }}
          >
            <span className="material-symbols-outlined">balance</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Gouvernance coopérative</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Module 2 / 5 · 35%</div>
          </div>
          <span className="material-symbols-outlined text-neutral-500">chevron_right</span>
        </div>
      </div>
    </HubLayout>
  );
}
