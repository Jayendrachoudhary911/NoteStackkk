// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  getUserNotes,
  createNote,
  deleteNote,
} from '../services/noteService';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userNotes = await getUserNotes(user.uid);
        const sortedNotes = userNotes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotes(sortedNotes);
        setFilteredNotes(sortedNotes);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      const updated = notes.filter((note) => note.id !== id);
      setNotes(updated);
      setFilteredNotes(updated);
    }
  };

  const handleCreateNote = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert('User not logged in');

    const noteId = await createNote(user.uid);
    navigate(`/editor/${noteId}`);
  };

  const handleSearch = (term) => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onCreateNote={handleCreateNote} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <input
            type="text"
            placeholder="🔍 Search your notes..."
            className="search-bar"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <h2>Your Notes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="notes-grid">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => navigate(`/note/${note.id}`)} onDelete={handleDelete} />
              ))
            ) : (
              <p>No notes found. Create one from the editor!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
