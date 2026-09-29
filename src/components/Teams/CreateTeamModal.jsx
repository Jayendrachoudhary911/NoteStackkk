import React, { useState } from 'react';
import { Users, X, Sparkles, Loader2 } from 'lucide-react';
import { useTeam } from '../../context/TeamContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const TEAM_ICONS = ['👥', '🚀', '⚡', '💼', '🔬', '🎯', '💡', '🌟', '🛠️', '🌐'];
const TEAM_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

export default function CreateTeamModal({ open, onClose }) {
  const { createTeam } = useTeam();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('👥');
  const [color, setColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEscapeKey(onClose, open);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a team name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createTeam({
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 460, padding: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Create New Team</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Collaborate with team members on shared notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Icon and Color Selection */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                Team Icon
              </label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 220 }}>
                {TEAM_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    style={{
                      fontSize: '1.1rem',
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: icon === emoji ? 'var(--surface-container-highest)' : 'transparent',
                      border: icon === emoji ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flexGrow: 1 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                Brand Color
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {TEAM_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: c,
                      cursor: 'pointer',
                      border: color === c ? '2px solid #fff' : '2px solid transparent',
                      boxShadow: color === c ? '0 0 0 2px ' + c : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Team Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Design Studio, Marketing, Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '0.88rem',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="What does this team do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="ns-btn ns-btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ns-btn ns-btn-primary"
              style={{ padding: '8px 18px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Create Team</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
