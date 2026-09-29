import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyPinned from '../components/Illustrations/EmptyPinned';
import EmptyState from '../components/UI/EmptyState';
import { NoteCardSkeleton } from '../components/UI/Skeleton';

export default function PinnedPage() {
  const navigate = useNavigate();
  const { pinnedNotes, loading } = useNotes();

  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  if (loading) {
    return (
      <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <NoteCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Pin size={24} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Pinned Notes
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
          Notes pinned to the top of your workspace for immediate access
        </p>
      </div>

      {pinnedNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyPinned size={180} />}
          title="No pinned notes"
          description="Pin your active projects or daily reference documents by clicking the pin icon on any note."
          actionLabel="Explore all notes"
          onAction={() => navigate('/notes')}
        />
      ) : (
        <NoteGrid
          notes={pinnedNotes}
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
