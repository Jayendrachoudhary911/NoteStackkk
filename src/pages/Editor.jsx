// src/pages/Editor.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  getNoteById,
  updateNoteContent,
  createNote,
} from '../services/noteService';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import '../styles/editor.css';
import '../styles/EditorToolbar.css';


const Editor = () => {
  const editorRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const noteId = queryParams.get('id');

  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          const note = await getNoteById(noteId);
          if (note) {
            setTitle(note.title);
            if (editorRef.current) {
              editorRef.current.innerHTML = note.content;
            }
          }
        } catch (err) {
          alert('Failed to load note.');
        }
      }
      setLoading(false);
    };
    loadNote();
  }, [noteId]);

  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('Please login first');

    if (noteId) {
      await updateNoteContent(noteId, { title, content });
      alert('Note updated!');
    } else {
      const newNoteId = await createNote(user.uid);
      await updateNoteContent(newNoteId, { title, content });
      alert('Note created!');
      navigate(`/editor/${newNoteId}`);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleImageInsert = () => {
    const url = prompt('Enter image URL:');
    if (url) execCommand('insertImage', url);
  };

  const handleVideoInsert = () => {
    const url = prompt('Enter video URL (YouTube embed or MP4):');
    if (url) {
      const embed = `<video controls style="max-width:100%"><source src="${url}" type="video/mp4"></video>`;
      editorRef.current.focus();
      document.execCommand('insertHTML', false, embed);
    }
  };

  if (loading) return <p>Loading note...</p>;

  return (
    <div className="editor-container">
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="note-title-input"
      />

      {/* === Toolbar === */}
      <div className="editor-toolbar">
        <button onClick={() => execCommand('bold')}><b>B</b></button>
        <button onClick={() => execCommand('italic')}><i>I</i></button>
        <button onClick={() => execCommand('underline')}><u>U</u></button>
        <button onClick={() => execCommand('strikeThrough')}>S̶</button>

        <select onChange={(e) => execCommand('fontSize', e.target.value)}>
          <option value="3">Font Size</option>
          <option value="1">8px</option>
          <option value="2">10px</option>
          <option value="3">12px</option>
          <option value="4">16px</option>
          <option value="5">20px</option>
          <option value="6">24px</option>
          <option value="7">28px</option>
        </select>

        <select onChange={(e) => execCommand('fontName', e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier</option>
          <option value="Georgia">Georgia</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Times New Roman">Times</option>
          <option value="Verdana">Verdana</option>
        </select>

        <button onClick={() => execCommand('justifyLeft')}>⬅️</button>
        <button onClick={() => execCommand('justifyCenter')}>🔳</button>
        <button onClick={() => execCommand('justifyRight')}>➡️</button>

        <button onClick={handleImageInsert}>🖼️</button>
        <button onClick={handleVideoInsert}>🎬</button>

        <button onClick={() => execCommand('undo')}>↩️ Undo</button>
        <button onClick={() => execCommand('redo')}>↪️ Redo</button>
        <button onClick={() => execCommand('removeFormat')}>🚫 Clear</button>
      </div>

      {/* === Editable Area === */}
      <div
        id="editor"
        ref={editorRef}
        contentEditable
        placeholder="Write your note here..."
        className="note-editor"
      ></div>

      {/* === Save Button === */}
      <button onClick={handleSave} className="save-button">
        💾 {noteId ? 'Update Note' : 'Save Note'}
      </button>
    </div>
  );
};

export default Editor;
