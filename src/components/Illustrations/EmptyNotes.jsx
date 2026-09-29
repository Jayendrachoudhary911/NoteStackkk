import React from 'react';

export default function EmptyNotes({ size = 180 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <defs>
        <radialGradient id="noteGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="100" cy="100" r="75" fill="url(#noteGlow)" />

      {/* Floating Sheets Background */}
      <rect
        x="65"
        y="45"
        width="80"
        height="110"
        rx="12"
        fill="var(--surface-container-high)"
        transform="rotate(-10 65 45)"
        opacity="0.6"
      />
      <rect
        x="75"
        y="45"
        width="80"
        height="110"
        rx="12"
        fill="var(--surface-container-high)"
        transform="rotate(6 75 45)"
        opacity="0.8"
      />

      {/* Main Notebook */}
      <rect
        x="60"
        y="50"
        width="80"
        height="105"
        rx="12"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="2.5"
      />

      {/* Notebook Spine Accent */}
      <path
        d="M 60 62 L 60 143"
        stroke="var(--accent)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Ruled lines inside notebook */}
      <rect x="74" y="68" width="48" height="4" rx="2" fill="var(--accent)" opacity="0.9" />
      <rect x="74" y="82" width="52" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.4" />
      <rect x="74" y="94" width="42" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.4" />
      <rect x="74" y="106" width="48" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.4" />
      <rect x="74" y="118" width="34" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.4" />

      {/* Floating Little Stars / Sparkles */}
      <path
        d="M 155 45 Q 155 52 162 52 Q 155 52 155 59 Q 155 52 148 52 Q 155 52 155 45 Z"
        fill="var(--accent)"
      />
      <path
        d="M 40 90 Q 40 95 45 95 Q 40 95 40 100 Q 40 95 35 95 Q 40 95 40 90 Z"
        fill="var(--accent)"
        opacity="0.8"
      />
      <circle cx="160" cy="115" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="48" cy="135" r="2.5" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}
