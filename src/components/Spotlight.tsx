'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SpotlightProject } from '@/types';
import { Avatar } from './Avatar';

interface SpotlightProps {
  project: SpotlightProject;
}

export const Spotlight: React.FC<SpotlightProps> = ({ project }) => {
  const t = useTranslations('dashboard.spotlight');
  return (
    <Link href="/build-hub" className="spot tap" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="ph">
        <div
          className="grad-tag pill"
          style={{
            background: 'rgba(0,0,0,.32)',
            color: '#FFD600',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,.18)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>star</span>
          {t(project.tagKey)}
        </div>
        <button
          className="like pill"
          aria-label="Follow"
          onClick={(e) => {
            e.preventDefault();
            // like action
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>favorite</span>
        </button>
        <div className="place">
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>location_on</span>
          {project.place}
        </div>
      </div>
      <div className="info">
        <h3>{project.name}</h3>
        <p>{project.desc}</p>
        <div className="row">
          <div style={{ flex: 1, marginRight: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                marginBottom: '6px',
                color: 'rgba(251,243,228,.72)',
              }}
            >
              <span>{t('milestone_progress')}</span>
              <b style={{ color: '#fff' }}>
                {project.ms} / {project.msTotal}
              </b>
            </div>
            <div className="bar">
              <span
                style={{
                  width: `${project.pct}%`,
                  background: 'linear-gradient(90deg, var(--brand-gold), var(--build-green))',
                }}
              ></span>
            </div>
          </div>
          <div className="stack">
            {project.team.map((tm, idx) => (
              <Avatar key={idx} initials={tm[0]} color={tm[1]} className="av" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
