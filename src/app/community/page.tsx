'use client';

import React from 'react';
import { HubLayout } from '@/components/HubLayout';
import { Avatar } from '@/components/Avatar';

export default function CommunityHubPage() {
  const tabs: [string, string | null][] = [
    ['Feed', null],
    ['Co-ops', null],
    ['Events', '3'],
  ];

  return (
    <HubLayout
      hubKey="community"
      tabs={tabs}
      searchPlaceholder="Rechercher discussions et membres"
    >
      <div className="hsec px-0">
        <div className="hd flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Fil de l'assemblée</h2>
          <button className="more text-sm font-semibold text-[var(--primary)]">Tout voir</button>
        </div>

        {/* Card 1 */}
        <div className="hcard mb-4">
          <div style={{ display: 'flex', gap: '11px', alignItems: 'center' }}>
            <Avatar initials="KP" color="#E57373" className="w-[30px] h-[30px]" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Kaelan Patel</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>il y a 2 h · Lagos, NG</div>
            </div>
            <span className="material-symbols-outlined" style={{ marginLeft: 'auto', color: 'var(--ink-faint)' }}>
              more_horiz
            </span>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.5 }}>
            Je cherche des conseils pour enregistrer une coopérative au Nigéria — quelqu'un a déjà fait la démarche ? Quelles sont les étapes clés ?
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <span className="pill" style={{ background: 'color-mix(in srgb, var(--secondary) 16%, transparent)', color: 'var(--secondary)' }}>
              #Legal
            </span>
            <span className="pill" style={{ background: 'color-mix(in srgb, var(--secondary) 16%, transparent)', color: 'var(--secondary)' }}>
              #Startup
            </span>
          </div>
          <div style={{ display: 'flex', gap: '18px', marginTop: '13px', color: 'var(--ink-faint)', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>favorite</span>
              24
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>chat_bubble</span>
              8
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>share</span>
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="hcard">
          <div style={{ display: 'flex', gap: '11px', alignItems: 'center' }}>
            <Avatar initials="FD" color="#00796B" className="w-[30px] h-[30px]" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Fatou Diallo</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>il y a 5 h · Dakar, SN</div>
            </div>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.5 }}>
            Notre coopérative de teinture lance une formation indigo le mois prochain — places limitées !
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
