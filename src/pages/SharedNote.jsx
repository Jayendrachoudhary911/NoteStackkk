import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteById } from '../services/noteService';

function SharedNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const fetchedNote = await getNoteById(id);
      setNote(fetchedNote);
    };
    fetchNote();
  }, [id]);

  if (!note) return <p>Loading shared note...</p>;

  return (
    <div className="shared-note-container">
      <h2>{note.title}</h2>
      <div className="shared-note-content">
        {note.content}
      </div>
    </div>
  );
}

export default SharedNote;
