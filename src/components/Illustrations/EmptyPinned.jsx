import React from 'react';

export default function EmptyPinned({ size = 200 }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <defs>
        <linearGradient id="pinnedGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="100" r="75" fill="url(#pinnedGlow)" />

      {/* Tilted Pin Board Paper */}
      <g transform="rotate(-4 120 100)">
        <rect
          x="75"
          y="50"
          width="90"
          height="115"
          rx="14"
          fill="var(--surface-container-high, #1e293b)"
          stroke="var(--border-subtle, rgba(255,255,255,0.1))"
          strokeWidth="1.5"
        />
        <rect x="90" y="75" width="60" height="8" rx="4" fill="#f59e0b" opacity="0.35" />
        <rect x="90" y="92" width="45" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.25" />
        <rect x="90" y="106" width="55" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />

        {/* Pin on top */}
        <circle cx="120" cy="50" r="8" fill="#f59e0b" />
        <circle cx="120" cy="50" r="4" fill="#ffffff" />
      </g>
    </svg>
  );
}
