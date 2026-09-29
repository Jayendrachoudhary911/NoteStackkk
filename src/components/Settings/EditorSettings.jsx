import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function EditorSettings() {
  const { showToast } = useToast();

  const [spellcheck, setSpellcheck] = useState(() => {
    return localStorage.getItem('notestack_editor_spellcheck') !== 'false';
  });
  const [lineWidth, setLineWidth] = useState(() => {
    return localStorage.getItem('notestack_editor_line_width') || '840';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('notestack_editor_font_size') || 'normal';
  });
  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem('notestack_editor_compact') === 'true';
  });

  const handleToggleSpellcheck = () => {
    const next = !spellcheck;
    setSpellcheck(next);
    localStorage.setItem('notestack_editor_spellcheck', String(next));
    showToast(`Spellcheck ${next ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleChangeLineWidth = (width) => {
    setLineWidth(width);
    localStorage.setItem('notestack_editor_line_width', width);
    showToast(`Reading width set to ${width === '100%' ? 'Full width' : width + 'px'}`, 'info');
  };

  const handleChangeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('notestack_editor_font_size', size);
    showToast(`Font size set to ${size}`, 'info');
  };

  const handleToggleCompact = () => {
    const next = !compactMode;
    setCompactMode(next);
    localStorage.setItem('notestack_editor_compact', String(next));
    showToast(`Compact mode ${next ? 'enabled' : 'disabled'}`, 'info');
  };

  return (
    <div className="ns-card" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Sliders size={20} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Editor Preferences</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Spellcheck Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Browser Spellcheck</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
              Underline misspelled words as you write in BlockNote
            </div>
          </div>
          <button
            onClick={handleToggleSpellcheck}
            className={`ns-btn ${spellcheck ? 'ns-btn-primary' : 'ns-btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            {spellcheck ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Reading Line Width */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>Writing Surface Width</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', marginBottom: 12 }}>
            Choose maximum content width for readability and comfortable typing
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: '760', label: 'Comfortable (760px)' },
              { id: '840', label: 'Standard (840px)' },
              { id: '1000', label: 'Wide (1000px)' },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => handleChangeLineWidth(w.id)}
                className={`ns-btn ${lineWidth === w.id ? 'ns-btn-primary' : 'ns-btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>Editor Typography Scale</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)', marginBottom: 12 }}>
            Adjust editor text size for comfortable reading
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: 'normal', label: 'Standard (1.05rem)' },
              { id: 'large', label: 'Spacious (1.18rem)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleChangeFontSize(f.id)}
                className={`ns-btn ${fontSize === f.id ? 'ns-btn-primary' : 'ns-btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Compact Cards & Lists</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
              Condense padding across note cards and listings
            </div>
          </div>
          <button
            onClick={handleToggleCompact}
            className={`ns-btn ${compactMode ? 'ns-btn-primary' : 'ns-btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            {compactMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
}
