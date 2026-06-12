'use client';

import React from 'react';
import { HubLayout } from '@/components/HubLayout';
import { SvgGauge } from '@/components/SvgGauge';

interface BrandHubClientPageProps {
  score: number;
  delta: number;
  notes: string | null;
  recordedAt: string | null;
}

export default function BrandHubClientPage({
  score,
  delta,
  notes,
  recordedAt,
}: BrandHubClientPageProps) {
  const tabs: [string, string | null][] = [
    ['Story', null],
    ['Reach', null],
    ['Impact', null],
  ];

  const formatDelta = (d: number) => {
    if (d > 0) return `+${d} cette semaine`;
    if (d < 0) return `${d} cette semaine`;
    return 'Stable cette semaine';
  };

  return (
    <HubLayout
      hubKey="brand"
      tabs={tabs}
      searchPlaceholder="Rechercher modèles & assets"
    >
      <div className="hsec px-0 flex flex-col items-center pt-6 text-center">
        <div className="eyebrow font-bold tracking-widest text-[var(--brand-gold)]" style={{ letterSpacing: '.2em' }}>
          BRAND IMPACT
        </div>
        <div style={{ display: 'grid', placeItems: 'center', margin: '14px 0 6px' }}>
          <SvgGauge score={score} size={168} stroke={14} />
        </div>
        <div
          className="pill"
          style={{
            background: 'color-mix(in srgb, var(--build-green) 16%, transparent)',
            color: 'var(--build-green)',
            marginTop: '4px',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px', marginRight: '4px' }}>
            trending_up
          </span>
          {formatDelta(delta)}
        </div>
        <p style={{ margin: '14px auto 0', maxWidth: '260px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          {notes || 'Résonance actuelle de votre communauté. Croissance régulière.'}
        </p>
        {recordedAt && (
          <div className="text-[10px] text-[var(--ink-faint)] mt-2">
            Mis à jour le : {new Date(recordedAt).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>

      <div className="hsec px-0 mt-6">
        <div className="hcard flex items-center gap-3">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in srgb, var(--brand-gold) 18%, transparent)',
              color: 'var(--brand-gold)',
            }}
          >
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>Renforcer la brand story</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>2 sections manquantes · +4 impact</div>
          </div>
          <span className="material-symbols-outlined text-neutral-500">chevron_right</span>
        </div>
      </div>
    </HubLayout>
  );
}
