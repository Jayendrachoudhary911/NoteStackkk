import React from 'react';

export default function EmptyFavorites({ size = 180 }) {
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
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Glow */}
      <circle cx="100" cy="100" r="75" fill="url(#starGlow)" />

      {/* Orbiting Note Card 1 */}
      <rect
        x="35"
        y="45"
        width="40"
        height="50"
        rx="6"
        fill="var(--surface-container-high)"
        transform="rotate(-15 35 45)"
        opacity="0.8"
      />
      <rect x="42" y="58" width="22" height="3" rx="1" fill="var(--accent)" opacity="0.6" transform="rotate(-15 35 45)" />

      {/* Orbiting Note Card 2 */}
      <rect
        x="130"
        y="110"
        width="38"
        height="48"
        rx="6"
        fill="var(--surface-container-high)"
        transform="rotate(18 130 110)"
        opacity="0.8"
      />
      <rect x="136" y="122" width="20" height="3" rx="1" fill="var(--accent)" opacity="0.6" transform="rotate(18 130 110)" />

      {/* Center Large Glowing Star */}
      <path
        d="M 100 45 
           L 112 79 
           L 148 80 
           L 119 101 
           L 130 135 
           L 100 114 
           L 70 135 
           L 81 101 
           L 52 80 
           L 88 79 
           Z"
        fill="var(--accent)"
        stroke="var(--accent-foreground)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Small floating sparkles */}
      <circle cx="150" cy="50" r="3" fill="var(--accent)" opacity="0.7" />
      <circle cx="50" cy="130" r="2.5" fill="var(--accent)" opacity="0.6" />
      <circle cx="100" cy="160" r="2" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}
