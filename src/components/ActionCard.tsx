'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ActionItem, ActionKind } from '@/types';
import { HUB_CONFIG } from '@/data/mockData';

interface ActionCardProps {
  action: ActionItem;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const t = useTranslations('dashboard.actions');
  const H = HUB_CONFIG[action.hub];

  const titleKey: ActionKind = action.kind;
  const detailKey = `${action.kind}_detail` as const;

  // Pass action.data through as i18n interpolation values
  const values: Record<string, string | number> = { ...action.data };

  // For reply_discussion, the `title` slot holds a #tags string. Render the
  // template via t() and post-process the output to wrap #tokens in
  // <span class="hashtag"> for visual styling.
  let titleNode: React.ReactNode;
  if (action.kind === 'reply_discussion' && typeof values.title === 'string') {
    const tagsRaw = values.title;
    const rendered = t(titleKey, values);
    const tagPieces = tagsRaw.split(' ').filter(Boolean);

    const result: React.ReactNode[] = [];
    let cursor = 0;
    for (const piece of tagPieces) {
      const idx = rendered.indexOf(piece, cursor);
      if (idx === -1) continue;
      if (idx > cursor) {
        result.push(
          <React.Fragment key={`pre-${idx}`}>{rendered.slice(cursor, idx)}</React.Fragment>
        );
      }
      if (piece.startsWith('#')) {
        result.push(
          <span key={`tag-${idx}`} className="hashtag">
            {piece}{' '}
          </span>
        );
      } else {
        result.push(<React.Fragment key={`word-${idx}`}>{piece} </React.Fragment>);
      }
      cursor = idx + piece.length;
    }
    if (cursor < rendered.length) {
      result.push(<React.Fragment key="tail">{rendered.slice(cursor)}</React.Fragment>);
    }
    titleNode = <>{result}</>;
  } else {
    titleNode = t(titleKey, values);
  }

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
        <div className="t">{titleNode}</div>
        <div className="d">{t(detailKey, values)}</div>
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
