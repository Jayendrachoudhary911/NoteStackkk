import React from 'react';
import NoteCard from './NoteCard';

export default function NoteGrid({
  notes,
  onShare,
  onExport,
  onMove,
  onRename,
  isTrash = false,
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onShare={onShare}
          onExport={onExport}
          onMove={onMove}
          onRename={onRename}
          isTrash={isTrash}
        />
      ))}
    </div>
  );
}
