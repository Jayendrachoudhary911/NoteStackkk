import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, Eye } from 'lucide-react';
import { subscribeActiveUsers, touchPresence } from '../../firebase/presence';
import { useAuth } from '../../context/AuthContext';
import { useClickOutside } from '../../hooks/useClickOutside';

export default function ActiveUsersBar({ currentNoteId = null }) {
  const { currentUser, userProfile } = useAuth();
  const [activeUsers, setActiveUsers] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const containerRef = useClickOutside(() => setPopupOpen(false), popupOpen);

  // Heartbeat presence update
  useEffect(() => {
    if (!currentUser) return;
    const userPayload = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: userProfile?.fullName || currentUser.displayName,
    };

    touchPresence(userPayload, currentNoteId);

    const interval = setInterval(() => {
      touchPresence(userPayload, currentNoteId);
    }, 45000);

    return () => clearInterval(interval);
  }, [currentUser, userProfile, currentNoteId]);

  // Subscribe to all active users
  useEffect(() => {
    const unsub = subscribeActiveUsers((users) => {
      setActiveUsers(users);
    });
    return () => unsub();
  }, []);

  const displayList = activeUsers.length > 0 ? activeUsers : (currentUser ? [{
    uid: currentUser.uid,
    name: userProfile?.fullName || 'You',
    email: currentUser.email,
    online: true
  }] : []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => setPopupOpen((prev) => !prev)}
        className="ns-btn ns-btn-ghost"
        style={{
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          borderRadius: 'var(--radius-md)',
          background: popupOpen ? 'var(--surface-container-high)' : 'transparent',
        }}
        title="View active users in NoteStack"
      >
        {/* Overlapping Avatar Stack */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {displayList.slice(0, 3).map((u, i) => (
            <div
              key={u.uid || i}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: `hsl(${(i * 90 + 200) % 360}, 65%, 45%)`,
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--surface)',
                marginLeft: i > 0 ? -8 : 0,
                position: 'relative',
              }}
            >
              {(u.name || u.email || 'U').charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        {/* Green Online Dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981',
          }}
        />

        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
          {displayList.length} online
        </span>
        <ChevronDown size={12} style={{ color: 'var(--muted-foreground)' }} />
      </button>

      {/* Active Users Popover */}
      {popupOpen && (
        <div
          className="ns-menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            minWidth: 240,
            padding: '10px 12px',
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} style={{ color: 'var(--accent)' }} />
            <span>Active NoteStack Users ({displayList.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
            {displayList.map((u) => {
              const isSelf = u.uid === currentUser?.uid;
              const isViewingThisNote = currentNoteId && u.currentNoteId === currentNoteId;

              return (
                <div
                  key={u.uid || u.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-container-high)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: -1,
                          right: -1,
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#10b981',
                          border: '1px solid var(--surface)',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                        {u.name || u.email?.split('@')[0]} {isSelf && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
                        {isViewingThisNote ? 'Viewing this note' : 'Active now'}
                      </div>
                    </div>
                  </div>

                  {isViewingThisNote && (
                    <Eye size={13} style={{ color: 'var(--accent)' }} title="Currently viewing this note" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
