import React from 'react';

interface SvgGaugeProps {
  score: number;
  size?: number;
  stroke?: number;
}

export const SvgGauge: React.FC<SvgGaugeProps> = ({ score, size = 86, stroke = 9 }) => {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const gap = 0.16; // bottom gap fraction
  const arc = 1 - gap;
  const circ = 2 * Math.PI * r;
  const dash = circ * arc;
  const filled = dash * (score / 100);
  const rot = 90 + gap * 180; // rotate so gap sits at the bottom
  
  // Utilisation d'un ID stable basé sur un simple hash ou statique pour le SVG sous SSR
  const gradientId = "gauge-grad-indigo";

  return (
    <div className="gauge" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${rot}deg)` }}
        role="img"
        aria-label={`Brand Impact chart: ${score} out of 100`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--brand-teal)" />
            <stop offset="1" stopColor="var(--build-green)" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
      </svg>
      <div className="val">
        <div>
          <b style={{ fontSize: size > 80 ? '26px' : '15px' }}>{score}</b>
          <s>/ 100</s>
        </div>
      </div>
    </div>
  );
};
