// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import '../styles/Sidebar.css';

function Sidebar({ onCreateNote }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">📝 NoteStack</h2>

      <div className="sidebar-buttons">
        <button className="sidebar-btn" onClick={onCreateNote}>
          ➕ New Note
        </button>
        <button className="sidebar-btn">
          📁 Create Folder
        </button>
        <button className="sidebar-btn">
          🗑️ Recycle Bin
        </button>
      </div>

      <div className="sidebar-user-profile">
        {user && (
          <>
            <img
              src={user.photoURL || '/default-profile.png'}
              alt="User"
              className="sidebar-user-avatar"
            />
            <span className="sidebar-username">
              {user.displayName || 'User'}
            </span>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        🔒 Logout
      </button>
    </div>
  );
}

export default Sidebar;
