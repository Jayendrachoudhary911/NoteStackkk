import React, { useState } from 'react';
import { FolderX, Check, X } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function MoveToFolderModal({ open, onClose, note }) {
  const { folders, moveNote } = useNotes();
  const [selectedFolderId, setSelectedFolderId] = useState(note?.folderId || null);

  useEscapeKey(onClose, open);

  if (!open || !note) return null;

  const handleMove = async () => {
    await moveNote(note.id, selectedFolderId);
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
            marginBottom: 16,
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Move Note</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }} noWrap>
              Select a destination for "{note.title || 'Untitled'}"
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxHeight: 280,
            overflowY: 'auto',
            marginBottom: 20,
            paddingRight: 4,
          }}
        >
          {/* No Folder Option */}
          <div
            onClick={() => setSelectedFolderId(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: selectedFolderId === null ? 'var(--surface-container-high)' : 'var(--surface-container)',
              cursor: 'pointer',
              boxShadow: selectedFolderId === null ? 'var(--elevation-2)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            <FolderX size={18} style={{ color: 'var(--muted-foreground)' }} />
            <span style={{ flexGrow: 1, fontSize: '0.9rem', fontWeight: 500 }}>
              No folder (Root)
            </span>
            {selectedFolderId === null && <Check size={16} style={{ color: 'var(--accent)' }} />}
          </div>

          {/* User Folders */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--surface-container-high)' : 'var(--surface-container)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--elevation-2)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{folder.icon || '📁'}</span>
                <span style={{ flexGrow: 1, fontSize: '0.9rem', fontWeight: 500 }}>
                  {folder.name}
                </span>
                {isSelected && <Check size={16} style={{ color: 'var(--accent)' }} />}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="ns-btn ns-btn-secondary">
            Cancel
          </button>
          <button onClick={handleMove} className="ns-btn ns-btn-primary">
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
