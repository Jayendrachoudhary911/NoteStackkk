import React, { useState, useEffect, useRef } from 'react';
import { Edit3, X } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function RenameNoteModal({ open, onClose, note }) {
  const { updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open && note) {
      setTitle(note.title || '');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, note]);

  if (!open || !note) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await updateNote(note.id, { title: title.trim() });
    onClose();
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 400, padding: 24 }}
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
            <Edit3 size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Rename Note</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} className="ns-btn ns-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="ns-btn ns-btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
