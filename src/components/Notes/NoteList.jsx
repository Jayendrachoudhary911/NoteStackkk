import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Pin, MoreHorizontal, Folder } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';
import { useNotes } from '../../context/NotesContext';
import NoteMenu from './NoteMenu';

export default function NoteList({
  notes,
  onShare,
  onExport,
  onMove,
  onRename,
  isTrash = false,
}) {
  const navigate = useNavigate();
  const {
    folders,
    toggleFavorite,
    togglePinned,
    archiveNote,
    softDeleteNote,
    permanentlyDeleteNote,
    restoreNote,
    duplicateNote,
  } = useNotes();

  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);

  const getFolder = (folderId) => folders.find((f) => f.id === folderId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {notes.map((note) => {
        const folder = getFolder(note.folderId);
        const isMenuOpen = activeMenuNoteId === note.id;

        return (
          <div
            key={note.id}
            onClick={() => !isTrash && navigate(`/note/${note.id}`)}
            className="ns-card"
            style={{
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              cursor: isTrash ? 'default' : 'pointer',
              borderRadius: 'var(--radius-md)',
              position: 'relative',
              background: 'var(--surface-container)',
            }}
          >
            {/* Left: Icon and Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220, maxWidth: 320 }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>
                {note.icon || '📝'}
              </span>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {note.title || 'Untitled Note'}
              </span>
            </div>

            {/* Center: Content snippet */}
            <div
              style={{
                flexGrow: 1,
                fontSize: '0.85rem',
                color: 'var(--muted-foreground)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'none',
              }}
              className="desktop-preview"
            >
              {note.plainText || 'Empty note'}
            </div>

            {/* Right: Folder, Date, Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {folder && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'var(--surface-container-high)',
                    color: folder.color || 'var(--accent)',
                  }}
                >
                  <Folder size={11} />
                  {folder.name}
                </span>
              )}

              <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', minWidth: 70, textAlign: 'right' }}>
                {formatRelativeTime(note.updatedAt)}
              </span>

              {!isTrash && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button
                    onClick={() => togglePinned(note.id, note.isPinned)}
                    style={{
                      padding: 4,
                      borderRadius: 6,
                      color: note.isPinned ? 'var(--accent)' : 'var(--muted-foreground)',
                    }}
                    title={note.isPinned ? 'Unpin note' : 'Pin note'}
                  >
                    <Pin size={14} style={{ fill: note.isPinned ? 'var(--accent)' : 'none' }} />
                  </button>

                  <button
                    onClick={() => toggleFavorite(note.id, note.isFavorite)}
                    style={{
                      padding: 4,
                      borderRadius: 6,
                      color: note.isFavorite ? '#f5d397' : 'var(--muted-foreground)',
                    }}
                    title={note.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                  >
                    <Star size={14} style={{ fill: note.isFavorite ? '#f5d397' : 'none' }} />
                  </button>
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setActiveMenuNoteId(isMenuOpen ? null : note.id)}
                  style={{ padding: 4, borderRadius: 6, color: 'var(--muted-foreground)' }}
                  title="More actions"
                >
                  <MoreHorizontal size={16} />
                </button>

                {isMenuOpen && (
                  <NoteMenu
                    note={note}
                    onOpen={() => navigate(`/note/${note.id}`)}
                    onRename={onRename || (() => {})}
                    onDuplicate={duplicateNote}
                    onMove={onMove || (() => {})}
                    onToggleFavorite={toggleFavorite}
                    onTogglePin={togglePinned}
                    onArchive={archiveNote}
                    onShare={onShare || (() => {})}
                    onExport={onExport || (() => {})}
                    onDelete={isTrash ? permanentlyDeleteNote : softDeleteNote}
                    onRestore={restoreNote}
                    isTrash={isTrash}
                    onClose={() => setActiveMenuNoteId(null)}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
