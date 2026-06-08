import React from 'react';
import Link from 'next/link';
import { ActionItem } from '@/types';
import { HUB_CONFIG } from '@/data/mockData';

interface ActionCardProps {
  action: ActionItem;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const H = HUB_CONFIG[action.hub];
  
  const formattedDetail = action.d.split(' ').map((word, idx) => {
    if (word.startsWith('#')) {
      return (
        <span key={idx} className="hashtag">
          {word}{' '}
        </span>
      );
    }
    return word + ' ';
  });

  return (
    <Link href={H.href} className="act tap" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="tag"
        style={{
          background: `color-mix(in srgb, ${H.c} 18%, transparent)`,
          color: H.c,
        }}
      >
        <span className="material-symbols-outlined">{H.ico}</span>
      </div>
      <div className="body">
        <div className="t">{action.t}</div>
        <div className="d">{formattedDetail}</div>
      </div>
      {action.due && (
        <span
          className="due"
          style={{
            background: action.urgent
              ? 'color-mix(in srgb, var(--danger) 20%, transparent)'
              : 'color-mix(in srgb, var(--secondary) 18%, transparent)',
            color: action.urgent ? 'var(--danger)' : 'var(--secondary)',
          }}
        >
          {action.due}
        </span>
      )}
      <span className="material-symbols-outlined chev">chevron_right</span>
    </Link>
  );
};
