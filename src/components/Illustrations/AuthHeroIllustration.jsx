import React from 'react';

export default function AuthHeroIllustration({ size = 320 }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
      style={{ filter: 'drop-shadow(0 16px 32px rgba(59, 130, 246, 0.25))' }}
    >
      <defs>
        <linearGradient id="authHeroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="mainCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-container-high, #1e293b)" />
          <stop offset="100%" stopColor="var(--surface, #0f172a)" />
        </linearGradient>

        <linearGradient id="accentCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent, #3b82f6)" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Ambient background glow circle */}
      <circle cx="180" cy="150" r="120" fill="url(#authHeroGlow)" />

      {/* Back Layer Note Card (Slightly tilted) */}
      <g transform="rotate(-6 130 140)">
        <rect
          x="60"
          y="40"
          width="150"
          height="190"
          rx="20"
          fill="var(--surface-container-low, #0b0c10)"
          stroke="var(--border-subtle, rgba(255,255,255,0.08))"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <rect x="80" y="65" width="70" height="10" rx="5" fill="var(--muted-foreground, #94a3b8)" opacity="0.3" />
        <rect x="80" y="85" width="100" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />
        <rect x="80" y="100" width="85" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />
      </g>

      {/* Second Floating Note Card (Tilted right) */}
      <g transform="rotate(7 240 160)">
        <rect
          x="170"
          y="65"
          width="145"
          height="180"
          rx="20"
          fill="var(--surface-container, #16181f)"
          stroke="var(--border-subtle, rgba(255,255,255,0.12))"
          strokeWidth="1.5"
        />
        <rect x="190" y="90" width="80" height="12" rx="6" fill="#f59e0b" opacity="0.4" />
        <rect x="190" y="112" width="105" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.25" />
        <rect x="190" y="126" width="90" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />
        <rect x="190" y="140" width="75" height="6" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.2" />

        {/* Mini Checkbox items */}
        <circle cx="196" cy="168" r="5" fill="#10b981" />
        <rect x="208" y="165" width="60" height="6" rx="3" fill="var(--foreground, #f8fafc)" opacity="0.5" />
        <circle cx="196" cy="186" r="5" fill="#10b981" />
        <rect x="208" y="183" width="70" height="6" rx="3" fill="var(--foreground, #f8fafc)" opacity="0.5" />
      </g>

      {/* Main Front Focus Card */}
      <g transform="translate(100, 70)">
        <rect
          width="165"
          height="195"
          rx="22"
          fill="url(#mainCardGrad)"
          stroke="var(--accent, #3b82f6)"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* Note Header */}
        <rect x="20" y="24" width="30" height="30" rx="10" fill="url(#accentCardGrad)" />
        <text x="35" y="44" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
          ⚡
        </text>

        <rect x="60" y="28" width="80" height="11" rx="5" fill="var(--foreground, #f8fafc)" opacity="0.85" />
        <rect x="60" y="45" width="50" height="7" rx="3" fill="var(--muted-foreground, #94a3b8)" opacity="0.4" />

        {/* Content Paragraphs */}
        <rect x="20" y="75" width="125" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.35" />
        <rect x="20" y="92" width="110" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.3" />
        <rect x="20" y="109" width="120" height="8" rx="4" fill="var(--muted-foreground, #94a3b8)" opacity="0.25" />

        {/* Highlight badge on text */}
        <rect x="20" y="132" width="88" height="24" rx="8" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="1" />
        <text x="64" y="148" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          💬 Real-time sync
        </text>

        {/* Live Collaborator Avatars */}
        <g transform="translate(20, 166)">
          <circle cx="10" cy="10" r="10" fill="#3b82f6" stroke="var(--surface)" strokeWidth="2" />
          <circle cx="24" cy="10" r="10" fill="#ec4899" stroke="var(--surface)" strokeWidth="2" />
          <circle cx="38" cy="10" r="10" fill="#10b981" stroke="var(--surface)" strokeWidth="2" />
          <circle cx="56" cy="10" r="4" fill="#22c55e" />
        </g>
      </g>

      {/* Floating Sparkles & Accent Pills */}
      <g transform="translate(260, 40)">
        <rect width="60" height="22" rx="11" fill="url(#pillGrad)" opacity="0.9" />
        <text x="30" y="15" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">
          PRO
        </text>
      </g>

      <path
        d="M45 100l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z"
        fill="var(--accent, #3b82f6)"
        opacity="0.8"
      />
      <path
        d="M320 200l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
        fill="#ec4899"
        opacity="0.7"
      />
    </svg>
  );
}
