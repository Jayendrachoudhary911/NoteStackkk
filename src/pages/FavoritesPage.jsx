import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyFavorites from '../components/Illustrations/EmptyFavorites';
import EmptyState from '../components/UI/EmptyState';
import { NoteCardSkeleton } from '../components/UI/Skeleton';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favoriteNotes, loading } = useNotes();

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
          <Star size={24} style={{ color: '#f5d397', fill: '#f5d397' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Favorites
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
          Quick access to your most important and starred notes
        </p>
      </div>

      {favoriteNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyFavorites size={180} />}
          title="Nothing saved here yet"
          description="Click the star icon on any note card or in the editor toolbar to add it to your favorites."
          actionLabel="View all notes"
          onAction={() => navigate('/notes')}
        />
      ) : (
        <NoteGrid
          notes={favoriteNotes}
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
