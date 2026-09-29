import React from 'react';
import { Smile, X } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const EMOJI_CATEGORIES = [
  {
    name: 'Work & Ideas',
    emojis: ['💡', '📝', '💻', '🚀', '🎯', '⚡', '📊', '📈', '📌', '🔍', '⚙️', '🛠️'],
  },
  {
    name: 'Education & Study',
    emojis: ['📚', '📖', '🔬', '🎓', '📐', '🧠', '✏️', '📄', '🧪', '🔭', '🎨', '🧩'],
  },
  {
    name: 'Life & Personal',
    emojis: ['✈️', '☕', '🏠', '🌱', '🌟', '🧘', '🚲', '🎵', '🍕', '🎉', '🏖️', '❤️'],
  },
  {
    name: 'Symbols & Tags',
    emojis: ['🔥', '✨', '💎', '🔑', '🏷️', '🔒', '📦', '🔔', '💬', '🏆', '🌈', '☀️'],
  },
];

export default function IconPickerModal({ open, onClose, onSelectIcon }) {
  useEscapeKey(onClose, open);

  if (!open) return null;

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 360, padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Smile size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Choose Note Icon</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--muted-foreground)',
                  marginBottom: 6,
                }}
              >
                {cat.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onSelectIcon(emoji);
                      onClose();
                    }}
                    style={{
                      fontSize: '1.4rem',
                      padding: 8,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-container)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-container-high)';
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-container)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
