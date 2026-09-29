import React from 'react';
import { Palette, Sun, Moon, Laptop, Check } from 'lucide-react';
import { useAppTheme, M3_EXPRESSIVE_PALETTE } from '../../context/ThemeContext';

export default function AppearanceSettings() {
  const { themeMode, setThemeMode, accentKey, setAccentKey } = useAppTheme();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean, soft, and spacious' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Deep atmospheric #09090b anchor' },
    { id: 'system', label: 'System', icon: Laptop, desc: 'Matches device preference' },
  ];

  const accents = [
    { id: 'blue', label: 'Blue', color: M3_EXPRESSIVE_PALETTE.blue.accent },
    { id: 'amber', label: 'Amber', color: M3_EXPRESSIVE_PALETTE.amber.accent },
    { id: 'green', label: 'Green', color: M3_EXPRESSIVE_PALETTE.green.accent },
    { id: 'orange', label: 'Orange', color: M3_EXPRESSIVE_PALETTE.orange.accent },
    { id: 'purple', label: 'Purple', color: M3_EXPRESSIVE_PALETTE.purple.accent },
    { id: 'white', label: 'White', color: M3_EXPRESSIVE_PALETTE.white.accent },
  ];

  return (
    <div className="ns-card" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Palette size={20} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Appearance & Themes</h3>
      </div>

      {/* Theme Mode Selector */}
      <div style={{ marginBottom: 32 }}>
        <label
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--muted-foreground)',
            display: 'block',
            marginBottom: 12,
          }}
        >
          Theme Mode
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {themes.map((t) => {
            const isSelected = themeMode === t.id;
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => setThemeMode(t.id)}
                style={{
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                  boxShadow: isSelected ? 'var(--elevation-2)' : 'none',
                  border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Icon size={20} style={{ color: isSelected ? 'var(--accent)' : 'var(--muted-foreground)' }} />
                  {isSelected && <Check size={16} style={{ color: 'var(--accent)' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>{t.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* M3 Expressive Accent Palette */}
      <div>
        <label
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--muted-foreground)',
            display: 'block',
            marginBottom: 12,
          }}
        >
          M3 Expressive Accent Palette
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {accents.map((acc) => {
            const isSelected = accentKey === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => setAccentKey(acc.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                  boxShadow: isSelected ? 'var(--elevation-2)' : 'none',
                  border: isSelected ? '2px solid ' + acc.color : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: acc.color,
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{acc.label}</span>
                {isSelected && <Check size={15} style={{ color: acc.color, marginLeft: 'auto' }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
