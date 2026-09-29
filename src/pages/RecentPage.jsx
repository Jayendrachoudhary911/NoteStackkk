import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyRecent from '../components/Illustrations/EmptyRecent';
import EmptyState from '../components/UI/EmptyState';
import { NoteCardSkeleton } from '../components/UI/Skeleton';

export default function RecentPage() {
  const navigate = useNavigate();
  const { recentNotes, loading, createNote } = useNotes();

  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  const handleCreateNote = async () => {
    const note = await createNote();
    if (note?.id) navigate(`/note/${note.id}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <NoteCardSkeleton />
          <NoteCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Clock size={24} style={{ color: 'var(--accent)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Recent Notes
            </h1>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
            Notes you've opened or edited recently, sorted by activity
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="ns-btn ns-btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.92rem' }}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {recentNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyRecent size={180} />}
          title="No recent notes"
          description="Start creating or opening notes and they will automatically appear here."
          actionLabel="Create Note"
          actionIcon={Plus}
          onAction={handleCreateNote}
        />
      ) : (
        <NoteGrid
          notes={recentNotes}
          onShare={(n) => setShareNote(n)}
          onExport={(n) => setExportNote(n)}
          onMove={(n) => setMoveNoteTarget(n)}
          onRename={(n) => setRenameNoteTarget(n)}
        />
      )}

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
