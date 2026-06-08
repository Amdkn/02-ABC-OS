import React from 'react';

interface AvatarProps {
  initials: string;
  color: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color, className = '' }) => {
  const isPlus = initials.startsWith('+');
  return (
    <div
      className={`avatar ${className}`}
      style={{
        background: isPlus ? 'var(--card-2)' : color,
        color: isPlus ? 'var(--ink-soft)' : '#2A211B',
        fontSize: isPlus ? '11px' : undefined,
      }}
    >
      {initials}
    </div>
  );
};
