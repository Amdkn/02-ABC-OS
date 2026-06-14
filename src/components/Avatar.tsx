import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color, className = '' }) => {
  const isPlus = initials.startsWith('+');
  // Bug 19: overflow avatar like "+7" — parse the count and expose it as
  // aria-label + title so hover shows a tooltip and screen readers announce
  // "7 more team members" instead of raw "+7" (D1 receipt).
  const plusCount = isPlus ? parseInt(initials.slice(1), 10) : NaN;
  const plusLabel =
    isPlus && !Number.isNaN(plusCount)
      ? `${plusCount} more team members`
      : undefined;
  return (
    <div
      className={`avatar ${className}`}
      style={{
        background: isPlus ? 'var(--card-2)' : color,
        color: isPlus ? 'var(--ink-soft)' : '#2A211B',
        fontSize: isPlus ? '11px' : undefined,
      }}
      aria-label={plusLabel}
      title={plusLabel}
    >
      {initials}
    </div>
  );
};
