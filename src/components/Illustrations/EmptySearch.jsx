import React from 'react';

export default function EmptySearch({ size = 200 }) {
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
        <linearGradient id="searchGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="100" r="75" fill="url(#searchGlow)" />

      {/* Floating Document Behind */}
      <rect
        x="65"
        y="45"
        width="85"
        height="110"
        rx="14"
        fill="var(--surface-container-high, #1e293b)"
        stroke="var(--border-subtle, rgba(255,255,255,0.1))"
        strokeWidth="1.5"
      />
      <rect x="80" y="65" width="55" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.3" />
      <rect x="80" y="80" width="40" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />
      <rect x="80" y="94" width="48" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />

      {/* Big Stylized Magnifying Glass */}
      <circle
        cx="140"
        cy="105"
        r="40"
        fill="var(--surface-container, #0f172a)"
        stroke="var(--accent, #3b82f6)"
        strokeWidth="4"
      />
      <circle
        cx="140"
        cy="105"
        r="30"
        stroke="var(--accent, #3b82f6)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      {/* Handle */}
      <path
        d="M168 133L195 160"
        stroke="var(--accent, #3b82f6)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="195" cy="160" r="4" fill="var(--accent, #3b82f6)" />
    </svg>
  );
}
