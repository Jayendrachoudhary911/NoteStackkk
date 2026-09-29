import React from 'react';

export default function EmptyTags({ size = 200 }) {
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
        <linearGradient id="tagsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="100" r="75" fill="url(#tagsGlow)" />

      {/* Floating Tag 1 */}
      <g transform="rotate(-10 100 85)">
        <path
          d="M70 70h50l20 20-20 20H70a6 6 0 01-6-6V76a6 6 0 016-6z"
          fill="var(--surface-container-high, #1e293b)"
          stroke="var(--accent, #3b82f6)"
          strokeWidth="1.5"
        />
        <circle cx="76" cy="90" r="4" fill="var(--accent, #3b82f6)" />
        <rect x="88" y="86" width="30" height="8" rx="4" fill="var(--foreground, #f8fafc)" opacity="0.6" />
      </g>

      {/* Floating Tag 2 */}
      <g transform="rotate(12 140 120)">
        <path
          d="M100 105h55l22 22-22 22h-55a6 6 0 01-6-6v-32a6 6 0 016-6z"
          fill="var(--surface-container, #16181f)"
          stroke="#ec4899"
          strokeWidth="1.5"
        />
        <circle cx="106" cy="127" r="4" fill="#ec4899" />
        <rect x="118" y="123" width="35" height="8" rx="4" fill="#ec4899" opacity="0.6" />
      </g>
    </svg>
  );
}
