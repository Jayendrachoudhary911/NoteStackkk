import React, { useState } from 'react';
import { Tag, Plus, Hash, Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyTags from '../components/Illustrations/EmptyTags';
import EmptyState from '../components/UI/EmptyState';

export default function TagsPage() {
  const { tags, activeNotes, createTag, deleteTag } = useNotes();
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');

  // Modals for notes
  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  // Extract all unique tags used across notes as well as registered tags
  const allTagNames = Array.from(
    new Set([
      ...tags.map((t) => t.name),
      ...activeNotes.flatMap((n) => (Array.isArray(n.tags) ? n.tags : [])),
    ])
  ).filter(Boolean);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await createTag(newTagName.trim());
    setNewTagName('');
  };

  const filteredNotes = selectedTag
    ? activeNotes.filter((n) => (n.tags || []).includes(selectedTag))
    : activeNotes;

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Tag size={24} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Tags
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
          Browse and filter notes across your workspace using tags
        </p>
      </div>

      {/* Add Tag Row & Active Tags Cloud */}
      <div
        className="ns-card"
        style={{
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <form onSubmit={handleAddTag} style={{ display: 'flex', gap: 10, maxWidth: 400 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface-container-high)',
              borderRadius: 'var(--radius-md)',
              padding: '0 12px',
              flexGrow: 1,
            }}
          >
            <Hash size={16} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Create tag (e.g. work, ideas)..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 8px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.88rem',
                color: 'var(--foreground)',
              }}
            />
          </div>
          <button type="submit" className="ns-btn ns-btn-primary" style={{ padding: '0 16px' }}>
            <Plus size={16} />
            <span>Add</span>
          </button>
        </form>

        {/* Tag Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => setSelectedTag(null)}
            className="ns-btn"
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              background: selectedTag === null ? 'var(--accent)' : 'var(--surface-container-high)',
              color: selectedTag === null ? '#09090b' : 'var(--foreground)',
            }}
          >
            All Notes ({activeNotes.length})
          </button>

          {allTagNames.map((tagName) => {
            const isSelected = selectedTag === tagName;
            const count = activeNotes.filter((n) => (n.tags || []).includes(tagName)).length;
            const customTagDoc = tags.find((t) => t.name === tagName);

            return (
              <div
                key={tagName}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: isSelected ? 'var(--accent)' : 'var(--surface-container-high)',
                  color: isSelected ? '#09090b' : 'var(--foreground)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2px 4px 2px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: 'var(--elevation-2)',
                }}
              >
                <span
                  onClick={() => setSelectedTag(isSelected ? null : tagName)}
                  style={{ cursor: 'pointer', padding: '4px 6px 4px 0' }}
                >
                  #{tagName} ({count})
                </span>
                {customTagDoc && (
                  <button
                    onClick={() => deleteTag(customTagDoc.id)}
                    style={{
                      color: isSelected ? '#09090b' : 'var(--muted-foreground)',
                      padding: 4,
                      borderRadius: 4,
                      opacity: 0.7,
                    }}
                    title="Delete tag"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes tagged with selected tag */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyTags size={180} />}
          title={selectedTag ? `No notes tagged #${selectedTag}` : 'No notes found'}
          description="Add tags to notes in the editor or create new notes under this tag."
        />
      ) : (
        <NoteGrid
          notes={filteredNotes}
          onShare={(n) => setShareNote(n)}
          onExport={(n) => setExportNote(n)}
          onMove={(n) => setMoveNoteTarget(n)}
          onRename={(n) => setRenameNoteTarget(n)}
        />
      )}

      {/* Note Modals */}
      {shareNote && (
        <ShareModal
          open={Boolean(shareNote)}
          note={shareNote}
          onClose={() => setShareNote(null)}
        />
      )}

      {exportNote && (
        <ExportMenu
          open={Boolean(exportNote)}
          note={exportNote}
          onClose={() => setExportNote(null)}
        />
      )}

      {moveNoteTarget && (
        <MoveToFolderModal
          open={Boolean(moveNoteTarget)}
          note={moveNoteTarget}
          onClose={() => setMoveNoteTarget(null)}
        />
      )}

      {renameNoteTarget && (
        <RenameNoteModal
          open={Boolean(renameNoteTarget)}
          note={renameNoteTarget}
          onClose={() => setRenameNoteTarget(null)}
        />
      )}
    </div>
  );
}
