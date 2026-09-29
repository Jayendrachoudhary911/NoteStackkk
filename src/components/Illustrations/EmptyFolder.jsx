import React from 'react';

export default function EmptyFolder({ size = 180 }) {
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
        <radialGradient id="folderGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="75" fill="url(#folderGlow)" />

      {/* Back flap of folder */}
      <path
        d="M 45 75 C 45 70 49 66 54 66 L 85 66 L 98 76 L 146 76 C 151 76 155 80 155 85 L 155 140 C 155 145 151 149 146 149 L 54 149 C 49 149 45 145 45 140 Z"
        fill="var(--surface-container-high)"
      />

      {/* Colorful Cards popping out */}
      <rect
        x="60"
        y="52"
        width="38"
        height="50"
        rx="6"
        fill="var(--accent)"
        opacity="0.9"
        transform="rotate(-12 60 52)"
      />
      <rect
        x="105"
        y="48"
        width="40"
        height="52"
        rx="6"
        fill="#f5d397"
        opacity="0.85"
        transform="rotate(10 105 48)"
      />
      <rect
        x="80"
        y="42"
        width="42"
        height="56"
        rx="6"
        fill="#8cefcb"
        opacity="0.9"
      />

      {/* Front flap of open folder */}
      <path
        d="M 40 100 L 52 145 C 53 148 56 150 59 150 L 141 150 C 144 150 147 148 148 145 L 160 100 C 161 96 158 92 154 92 L 46 92 C 42 92 39 96 40 100 Z"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {/* Little accents */}
      <circle cx="50" cy="60" r="3" fill="var(--accent)" opacity="0.6" />
      <circle cx="155" cy="65" r="2.5" fill="var(--accent)" opacity="0.6" />
    </svg>
  );
}
