import React from 'react';

export default function EmptyTrash({ size = 180 }) {
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
        <radialGradient id="trashGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="75" fill="url(#trashGlow)" />

      {/* Floating Can Lid */}
      <path
        d="M 65 65 C 65 62 68 60 72 60 L 128 60 C 132 60 135 62 135 65 L 135 70 L 65 70 Z"
        fill="var(--surface-container-high)"
      />
      <rect x="92" y="54" width="16" height="6" rx="3" fill="var(--muted-foreground)" opacity="0.6" />

      {/* Trash Can Body */}
      <path
        d="M 70 78 L 78 142 C 79 148 83 152 89 152 L 111 152 C 117 152 121 148 122 142 L 130 78 Z"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="2.5"
      />

      {/* Ribs / Grooves on can body */}
      <line x1="88" y1="90" x2="91" y2="138" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="100" y1="90" x2="100" y2="138" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="112" y1="90" x2="109" y2="138" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

      {/* Clean sparkles radiating from empty trash */}
      <path
        d="M 145 80 Q 145 85 150 85 Q 145 85 145 90 Q 145 85 140 85 Q 145 85 145 80 Z"
        fill="var(--accent)"
      />
      <circle cx="55" cy="115" r="2.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="148" cy="125" r="3" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}
