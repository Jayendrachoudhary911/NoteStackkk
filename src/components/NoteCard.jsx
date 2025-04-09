// src/components/NoteCard.jsx
import React from 'react';
import '../styles/NoteCard.css'; // Make sure you have this file or adjust path accordingly

const NoteCard = ({ note, onDelete, onClick }) => {
  return (
    <div className="note-card" onClick={onClick}>
      <h3>{note.title || 'Untitled Note'}</h3>
      <p>{note.content?.slice(0, 100) || 'No content yet...'}</p>
      <small>{new Date(note.createdAt).toLocaleDateString()}</small>

      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevents note from opening
          onDelete(note.id);
        }}
      >
        🗑
      </button>
    </div>
  );
};

export default NoteCard;
