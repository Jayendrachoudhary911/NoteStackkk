import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteEditor from '../components/Editor/NoteEditor';
import { EditorSkeleton } from '../components/UI/Skeleton';

export default function NotePage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, loading, touchNote } = useNotes();

  const note = notes.find((n) => n.id === noteId);

  useEffect(() => {
    if (noteId) {
      touchNote(noteId);
    }
  }, [noteId, touchNote]);

  if (loading) {
    return <EditorSkeleton />;
  }

  if (!note) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Note not found</h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 20 }}>
          This note may have been deleted or moved.
        </p>
        <button onClick={() => navigate('/notes')} className="ns-btn ns-btn-primary">
          Back to All Notes
        </button>
      </div>
    );
  }

  return <NoteEditor note={note} />;
}
