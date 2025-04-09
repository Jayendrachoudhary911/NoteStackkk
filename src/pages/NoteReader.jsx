import React, { useEffect, useState } from 'react';
import { getNoteById, updateNoteById } from '../services/noteService';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles/noteReader.css';

const NoteReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      const fetchedNote = await getNoteById(id);
      if (fetchedNote) {
        setNote(fetchedNote);
        setUpdatedContent(fetchedNote.content);
      }
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content || '');
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(''), 1500);
  };

  const handleExport = () => {
    const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${note.title || 'note'}.txt`;
    anchor.click();
  };

  const handleUpdate = async () => {
    const res = await updateNoteById(id, { ...note, content: updatedContent });
    if (res.success || res.ok) {
      setNote(prev => ({ ...prev, content: updatedContent, updatedAt: new Date().toISOString() }));
      setUpdateStatus('✅ Note updated successfully!');
      setEditMode(false);
      setTimeout(() => setUpdateStatus(''), 2500);
    } else {
      setUpdateStatus('❌ Failed to update note.');
    }
  };

  const wordCount = updatedContent.trim().split(/\s+/).length;
  const charCount = updatedContent.length;

  if (loading) return <p>Loading note...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="note-reader-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h2>{note.title}</h2>

      {editMode ? (
         <textarea
           className="note-content editable"
           value={updatedContent}
           onChange={(e) => setUpdatedContent(e.target.value)}
           rows={10}
         />
       ) : (
         <div className="note-content markdown-preview">
           <ReactMarkdown>{note.content}</ReactMarkdown>
         </div>
       )}


      <div className="note-info">
        <span>🕒 Created: {new Date(note.createdAt).toLocaleString()}</span>
        <span>🔄 Updated: {new Date(note.updatedAt).toLocaleString()}</span>
        <span>✍️ Words: {wordCount}</span>
        <span>🔡 Characters: {charCount}</span>
      </div>

      <div className="note-actions">
        {editMode ? (
          <>
            <button onClick={handleUpdate} className="edit-btn">💾 Save</button>
            <button onClick={() => setEditMode(false)} className="copy-btn">❌ Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="edit-btn">✏️ Edit Note</button>
        )}
        {!editMode && (
          <>
            <button onClick={handleCopy} className="copy-btn">📋 Copy</button>
            <button onClick={handleExport} className="export-btn">📁 Export</button>
          </>
        )}
      </div>

      {copyStatus && <p className="copy-status">{copyStatus}</p>}
      {updateStatus && <p className="copy-status">{updateStatus}</p>}
    </div>
  );
};

export default NoteReader;
