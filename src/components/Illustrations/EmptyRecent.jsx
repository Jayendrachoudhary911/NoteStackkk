import React from 'react';

export default function EmptyRecent({ size = 200 }) {
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
        <linearGradient id="recentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="100" r="75" fill="url(#recentGlow)" />

      {/* Floating clock dial */}
      <circle
        cx="120"
        cy="100"
        r="48"
        fill="var(--surface-container-high, #1e293b)"
        stroke="var(--accent, #3b82f6)"
        strokeWidth="2.5"
      />
      <circle cx="120" cy="100" r="4" fill="var(--accent, #3b82f6)" />
      {/* Clock hands */}
      <path
        d="M120 100V76"
        stroke="var(--foreground, #f8fafc)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M120 100L138 112"
        stroke="var(--accent, #3b82f6)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Orbiting clock dash notches */}
      <circle cx="120" cy="62" r="2" fill="var(--muted-foreground, #94a3b8)" />
      <circle cx="158" cy="100" r="2" fill="var(--muted-foreground, #94a3b8)" />
      <circle cx="120" cy="138" r="2" fill="var(--muted-foreground, #94a3b8)" />
      <circle cx="82" cy="100" r="2" fill="var(--muted-foreground, #94a3b8)" />

      {/* Floating Sparkles */}
      <path
        d="M60 70l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"
        fill="var(--accent, #3b82f6)"
        opacity="0.8"
      />
      <path
        d="M185 140l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"
        fill="var(--accent, #3b82f6)"
        opacity="0.6"
      />
    </svg>
  );
}
