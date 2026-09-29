import React from 'react';
import {
  ExternalLink,
  Edit2,
  Copy,
  FolderInput,
  Star,
  Pin,
  Archive,
  Share2,
  Download,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function NoteMenu({
  note,
  onOpen,
  onRename,
  onDuplicate,
  onMove,
  onToggleFavorite,
  onTogglePin,
  onArchive,
  onShare,
  onExport,
  onDelete,
  onRestore,
  isTrash = false,
  onClose,
}) {
  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 899 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className="ns-menu"
        style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, minWidth: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isTrash ? (
          <>
            <button
              onClick={() => {
                onRestore(note.id);
                onClose();
              }}
              className="ns-menu-item"
            >
              <RotateCcw size={15} style={{ color: 'var(--accent)' }} />
              <span>Restore Note</span>
            </button>
            <button
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="ns-menu-item danger"
            >
              <Trash2 size={15} />
              <span>Delete Permanently</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                onOpen(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <ExternalLink size={15} />
              <span>Open</span>
            </button>

            <button
              onClick={() => {
                onRename(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Edit2 size={15} />
              <span>Rename</span>
            </button>

            <button
              onClick={() => {
                onDuplicate(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Copy size={15} />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => {
                onMove(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <FolderInput size={15} />
              <span>Move to folder...</span>
            </button>

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

            <button
              onClick={() => {
                onToggleFavorite(note.id, note.isFavorite);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Star
                size={15}
                style={{
                  color: note.isFavorite ? '#f5d397' : 'inherit',
                  fill: note.isFavorite ? '#f5d397' : 'none',
                }}
              />
              <span>{note.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={() => {
                onTogglePin(note.id, note.isPinned);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Pin size={15} style={{ color: note.isPinned ? 'var(--accent)' : 'inherit' }} />
              <span>{note.isPinned ? 'Unpin Note' : 'Pin Note'}</span>
            </button>

            <button
              onClick={() => {
                onArchive(note.id, note.isArchived);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Archive size={15} />
              <span>{note.isArchived ? 'Unarchive' : 'Archive'}</span>
            </button>

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

            <button
              onClick={() => {
                onShare(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            <button
              onClick={() => {
                onExport(note);
                onClose();
              }}
              className="ns-menu-item"
            >
              <Download size={15} />
              <span>Export</span>
            </button>

            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

            <button
              onClick={() => {
                onDelete(note.id);
                onClose();
              }}
              className="ns-menu-item danger"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
