import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import EmptyTrash from '../components/Illustrations/EmptyTrash';
import EmptyState from '../components/UI/EmptyState';
import ConfirmDialog from '../components/UI/ConfirmDialog';

export default function TrashPage() {
  const { trashNotes, emptyTrash } = useNotes();
  const [emptyTrashConfirm, setEmptyTrashConfirm] = useState(false);

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Trash2 size={24} style={{ color: 'var(--muted-foreground)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Trash
            </h1>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
            Notes in trash are preserved until emptied or permanently removed
          </p>
        </div>

        {trashNotes.length > 0 && (
          <button
            onClick={() => setEmptyTrashConfirm(true)}
            className="ns-btn ns-btn-danger"
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Trash2 size={16} />
            <span>Empty Trash ({trashNotes.length})</span>
          </button>
        )}
      </div>

      {trashNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyTrash size={180} />}
          title="Your trash is empty"
          description="Deleted notes will appear here where you can restore them or delete them permanently."
        />
      ) : (
        <NoteGrid
          notes={trashNotes}
          isTrash={true}
        />
      )}

      <ConfirmDialog
        open={emptyTrashConfirm}
        title="Empty all notes from trash?"
        description={`This will permanently delete all ${trashNotes.length} notes currently in your trash. This action cannot be undone.`}
        confirmLabel="Yes, Empty Trash"
        isDestructive={true}
        onConfirm={emptyTrash}
        onCancel={() => setEmptyTrashConfirm(false)}
      />
    </div>
  );
}
