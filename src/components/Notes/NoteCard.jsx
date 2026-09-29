import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Pin, MoreHorizontal, Folder } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';
import { useNotes } from '../../context/NotesContext';
import NoteMenu from './NoteMenu';

export default function NoteCard({
  note,
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const folder = folders.find((f) => f.id === note.folderId);
  const previewText = (note.plainText || '').trim() || 'No additional text';

  const handleClick = () => {
    if (isTrash) return;
    navigate(`/note/${note.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="ns-card"
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 200,
        cursor: isTrash ? 'default' : 'pointer',
        position: 'relative',
        background: 'var(--surface-container)',
        boxShadow: 'none',
      }}
    >
      {/* Top Header: Icon, Title, Actions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexGrow: 1 }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>
              {note.icon || '📝'}
            </span>
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--foreground)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {note.title || 'Untitled Note'}
            </h4>
          </div>

          {/* Quick Actions (Pin, Favorite, More) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              opacity: isHovered || menuOpen || note.isPinned || note.isFavorite ? 1 : 0,
              transition: 'opacity var(--transition-fast)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isTrash && (
              <>
                <button
                  onClick={() => togglePinned(note.id, note.isPinned)}
                  style={{
                    padding: 5,
                    borderRadius: 6,
                    color: note.isPinned ? 'var(--accent)' : 'var(--muted-foreground)',
                  }}
                  title={note.isPinned ? 'Unpin note' : 'Pin note'}
                >
                  <Pin size={15} style={{ fill: note.isPinned ? 'var(--accent)' : 'none' }} />
                </button>

                <button
                  onClick={() => toggleFavorite(note.id, note.isFavorite)}
                  style={{
                    padding: 5,
                    borderRadius: 6,
                    color: note.isFavorite ? '#f5d397' : 'var(--muted-foreground)',
                  }}
                  title={note.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                >
                  <Star size={15} style={{ fill: note.isFavorite ? '#f5d397' : 'none' }} />
                </button>
              </>
            )}

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  padding: 5,
                  borderRadius: 6,
                  color: 'var(--muted-foreground)',
                }}
                title="More options"
              >
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
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
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Note Content Preview */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--muted-foreground)',
            marginTop: 10,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {previewText}
        </p>
      </div>

      {/* Footer: Metadata, Folder Badge, Tags */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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

            {Array.isArray(note.tags) && note.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: 'var(--muted-foreground)',
                }}
              >
                #{t}
              </span>
            ))}
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              whiteSpace: 'nowrap',
            }}
          >
            {formatRelativeTime(note.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}