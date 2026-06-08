import React from 'react';
import Link from 'next/link';
import { FeedItem } from '@/types';
import { HUB_CONFIG } from '@/data/mockData';
import { Avatar } from './Avatar';

interface FeedCardProps {
  item: FeedItem;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item }) => {
  const H = HUB_CONFIG[item.hub];

  const getBadgeIcon = (hub: string) => {
    const m: Record<string, string> = { community: 'forum', learn: 'school', build: 'construction', brand: 'auto_awesome' };
    return m[hub] || 'info';
  };

  return (
    <Link href={H.href} className="fi tap" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ position: 'relative' }}>
        <Avatar initials={item.av[0]} color={item.av[1]} className="av" />
        <div className="badge" style={{ background: H.c }}>
          <span className="material-symbols-outlined" style={{ fontSize: '11px', color: '#14100d' }}>
            {getBadgeIcon(item.hub)}
          </span>
        </div>
      </div>
      <div className="ct">
        <div className="l">
          <b>{item.who}</b> {item.what} — {item.detail}
        </div>
        <div className="m">
          <span>{item.when}</span>
          {item.place && (
            <>
              <span>·</span>
              <span>{item.place}</span>
            </>
          )}
          <span>·</span>
          <span style={{ color: H.c, fontWeight: 700 }}>{H.name}</span>
        </div>
      </div>
    </Link>
  );
};
