'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { HubLayout } from '@/components/HubLayout';
import { Avatar } from '@/components/Avatar';

export default function CommunityHubPage() {
  const t = useTranslations('hubs.community');
  const tCommon = useTranslations('common');

  const tabs: [string, string | null][] = [
    [t('tabs.feed'), null],
    [t('tabs.coops'), null],
    [t('tabs.events'), '3'],
  ];

  return (
    <HubLayout
      hubKey="community"
      tabs={tabs}
      searchPlaceholder={t('searchPlaceholder')}
    >
      <div className="hsec px-0">
        <div className="hd flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">{t('feedTitle')}</h2>
          <button className="more text-sm font-semibold text-[var(--primary)]">{tCommon('seeAll')}</button>
        </div>

        {/* Card 1 */}
        <div className="hcard mb-4">
          <div style={{ display: 'flex', gap: '11px', alignItems: 'center' }}>
            <Avatar initials="KP" color="#E57373" className="w-[30px] h-[30px]" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Kaelan Patel</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>2 h ago · Lagos, NG</div>
            </div>
            <span className="material-symbols-outlined" style={{ marginLeft: 'auto', color: 'var(--ink-faint)' }}>
              more_horiz
            </span>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.5 }}>
            Looking for advice on registering a cooperative in Nigeria — has anyone gone through the process? What are the key steps?
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
              <div style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>5 h ago · Dakar, SN</div>
            </div>
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '14px', lineHeight: 1.5 }}>
            Our indigo dyeing cooperative is launching a training next month — limited spots!
          </p>
        </div>
      </div>
    </HubLayout>
  );
}
