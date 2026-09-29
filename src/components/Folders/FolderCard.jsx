import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function FolderCard({ folder, noteCount = 0, onEditFolder }) {
  const navigate = useNavigate();
  const { deleteFolder } = useNotes();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => navigate(`/folders/${folder.id}`)}
        className="ns-card"
        style={{
          padding: 20,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 140,
          borderLeft: `4px solid ${folder.color || 'var(--accent)'}`,
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{folder.icon || '📁'}</span>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)' }}>
                {folder.name}
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                {noteCount} note{noteCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ns-btn ns-btn-ghost"
              style={{ padding: 6, borderRadius: 6 }}
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 899 }}
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="ns-menu"
                  style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4 }}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEditFolder(folder);
                    }}
                    className="ns-menu-item"
                  >
                    <Edit2 size={14} />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmDeleteOpen(true);
                    }}
                    className="ns-menu-item danger"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'var(--surface-container-high)',
              color: 'var(--muted-foreground)',
            }}
          >
            Folder
          </span>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: folder.color || 'var(--accent)',
            }}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={`Delete folder "${folder.name}"?`}
        description="Deleting this folder will not delete the notes inside it. They will simply be moved to your main notes."
        confirmLabel="Delete Folder"
        onConfirm={() => deleteFolder(folder.id)}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
