'use client';

import React from 'react';
import { HubLayout } from '@/components/HubLayout';
import { Avatar } from '@/components/Avatar';

export default function BuildHubPage() {
  const tabs: [string, string | null][] = [
    ['Mes projets', null],
    ['Outils coop', null],
  ];

  return (
    <HubLayout
      hubKey="build"
      tabs={tabs}
      searchPlaceholder="Rechercher projets & outils"
    >
      <div className="hsec px-0">
        
        {/* Main Project Progress Card */}
        <div className="hcard mb-4" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '15px 15px 0' }}>
            <span
              className="pill"
              style={{
                background: 'color-mix(in srgb, var(--build-green) 18%, transparent)',
                color: 'var(--build-green)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: 'var(--build-green)',
                  marginRight: '6px',
                  display: 'inline-block',
                }}
              ></span>
              EN COURS
            </span>
          </div>
          <div style={{ padding: '14px 15px 0' }}>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Solaris Agri-Coop</h3>
            <p style={{ margin: '5px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
              Agriculture coopérative solaire · Kenya
            </p>
          </div>
          <div style={{ padding: '16px 15px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
              <b>Progression des jalons</b>
              <b style={{ color: 'var(--build-blue)' }}>3 / 5</b>
            </div>
            <div className="bar">
              <span style={{ width: '60%', background: 'var(--build-blue)' }}></span>
            </div>
            <div className="stack" style={{ marginTop: '14px' }}>
              <Avatar initials="KP" color="#3b82f6" className="w-[30px] h-[30px]" />
              <Avatar initials="FD" color="#13ec13" className="w-[30px] h-[30px]" />
              <Avatar initials="NJ" color="#FFC72C" className="w-[30px] h-[30px]" />
              <div
                className="avatar"
                style={{
                  background: 'var(--card-2)',
                  color: 'var(--ink-soft)',
                  width: '30px',
                  height: '30px',
                  fontSize: '11px',
                }}
              >
                +2
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Sections */}
        <div className="hsec px-0 mt-4">
          <div className="hd mb-3">
            <h2 className="text-lg font-bold">Prochains jalons</h2>
          </div>
          <div className="hcard flex items-center gap-3">
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                display: 'grid',
                placeItems: 'center',
                background: 'color-mix(in srgb, var(--build-blue) 18%, transparent)',
                color: 'var(--build-blue)',
              }}
            >
              <span className="material-symbols-outlined">water_drop</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Irrigation solaire</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Échéance demain · 2 tâches</div>
            </div>
            <span
              className="pill"
              style={{
                background: 'color-mix(in srgb, #E06B5B 20%, transparent)',
                color: '#E06B5B',
              }}
            >
              Demain
            </span>
          </div>
        </div>

      </div>
    </HubLayout>
  );
}
