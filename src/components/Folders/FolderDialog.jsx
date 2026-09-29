import React, { useState, useEffect, useRef } from 'react';
import { FolderPlus, FolderEdit, X } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const FOLDER_COLORS = [
  '#88b7f0', // Blue
  '#f5d397', // Amber
  '#8cefcb', // Green
  '#ffd6b4', // Orange
  '#c8b6ff', // Purple
  '#f472b6', // Pink
  '#38bdf8', // Sky
  '#a3e635', // Lime
];

const FOLDER_ICONS = ['📁', '📂', '💼', '🚀', '🎯', '📚', '💡', '🏷️'];

export default function FolderDialog({ open, onClose, folderToEdit }) {
  const { createFolder, updateFolder } = useNotes();
  const [name, setName] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const [icon, setIcon] = useState('📁');
  const inputRef = useRef(null);

  const isEditing = Boolean(folderToEdit);

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open) {
      if (folderToEdit) {
        setName(folderToEdit.name || '');
        setColor(folderToEdit.color || FOLDER_COLORS[0]);
        setIcon(folderToEdit.icon || '📁');
      } else {
        setName('');
        setColor(FOLDER_COLORS[0]);
        setIcon('📁');
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, folderToEdit]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      await updateFolder(folderToEdit.id, {
        name: name.trim(),
        color,
        icon,
      });
    } else {
      await createFolder({
        name: name.trim(),
        color,
        icon,
      });
    }
    onClose();
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 420, padding: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isEditing ? (
              <FolderEdit size={20} style={{ color: 'var(--accent)' }} />
            ) : (
              <FolderPlus size={20} style={{ color: 'var(--accent)' }} />
            )}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isEditing ? 'Rename Folder' : 'New Folder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Folder Name Input */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Folder Name
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              placeholder="e.g. Work, Projects, Ideas..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                fontSize: '0.95rem',
                color: 'var(--foreground)',
              }}
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Folder Icon
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {FOLDER_ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setIcon(ic)}
                  style={{
                    fontSize: '1.25rem',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: icon === ic ? 'var(--surface-container-high)' : 'transparent',
                    boxShadow: icon === ic ? 'var(--elevation-2)' : 'none',
                    border: icon === ic ? '1px solid var(--accent)' : 'none',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Accent Color
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {FOLDER_COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    boxShadow: color === c ? '0 0 0 3px var(--surface), 0 0 0 5px ' + c : 'none',
                    transition: 'transform var(--transition-fast)',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="ns-btn ns-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="ns-btn ns-btn-primary">
              {isEditing ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
