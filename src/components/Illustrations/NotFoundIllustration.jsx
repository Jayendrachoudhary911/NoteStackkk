import React from 'react';

export default function NotFoundIllustration({ size = 260 }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 320 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
      style={{ filter: 'drop-shadow(0 12px 24px rgba(59, 130, 246, 0.2))' }}
    >
      <defs>
        <linearGradient id="bgGrad404" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="primaryGrad404" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="cardGrad404" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-container-high, #1e293b)" />
          <stop offset="100%" stopColor="var(--surface, #0f172a)" />
        </linearGradient>
      </defs>

      {/* Ambient background glow ring */}
      <circle cx="160" cy="128" r="96" fill="url(#bgGrad404)" />
      <circle cx="160" cy="128" r="112" stroke="var(--accent, #3b82f6)" strokeOpacity="0.15" strokeDasharray="6 6" />

      {/* Floating Little Constellation Dots */}
      <circle cx="50" cy="60" r="2.5" fill="var(--accent, #3b82f6)" opacity="0.6" />
      <circle cx="280" cy="80" r="2" fill="var(--accent, #3b82f6)" opacity="0.4" />
      <circle cx="290" cy="170" r="3" fill="var(--accent, #3b82f6)" opacity="0.5" />
      <circle cx="40" cy="190" r="2" fill="var(--accent, #3b82f6)" opacity="0.3" />

      {/* Central Floating Missing Document Card */}
      <g transform="translate(100, 48)">
        <rect
          width="120"
          height="160"
          rx="18"
          fill="url(#cardGrad404)"
          stroke="var(--border-subtle, rgba(255,255,255,0.15))"
          strokeWidth="1.5"
        />

        {/* Card Header lines */}
        <rect x="18" y="24" width="84" height="12" rx="6" fill="var(--accent, #3b82f6)" opacity="0.3" />
        <rect x="18" y="44" width="56" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.3" />
        <rect x="18" y="60" width="70" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />

        {/* 404 Bold Typography Center Badge */}
        <rect x="18" y="86" width="84" height="50" rx="12" fill="var(--surface-container, #0f172a)" opacity="0.9" />
        <text
          x="60"
          y="120"
          fill="var(--accent, #3b82f6)"
          fontSize="24"
          fontWeight="800"
          textAnchor="middle"
          letterSpacing="1"
        >
          404
        </text>

        {/* Question Mark / Magnifier Floating Beside */}
        <circle cx="106" cy="142" r="16" fill="url(#primaryGrad404)" />
        <path
          d="M106 135c-2.2 0-4 1.8-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 2-2 3.5v.5h2v-.5c0-1 2-1.8 2-3.5 0-2.2-1.8-4-4-4zm-1 9v2h2v-2h-2z"
          fill="#ffffff"
        />
      </g>

      {/* Floating Sparkle Elements */}
      <path
        d="M65 110l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
        fill="var(--accent, #3b82f6)"
        opacity="0.75"
      />
      <path
        d="M255 130l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"
        fill="var(--accent, #3b82f6)"
        opacity="0.6"
      />
    </svg>
  );
}
