import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Home,
  FileText,
  Search,
  Star,
  MoreHorizontal,
  Plus,
  Folder,
  Tag,
  Trash2,
  Settings,
  Clock,
  Pin,
  X,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';
import { useAppTheme } from '../../context/ThemeContext';
import { useTeam } from '../../context/TeamContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function MobileNav({ onOpenCommandPalette }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const { currentTeam } = useTeam();
  const { activeNotes, favoriteNotes, folders, tags, trashNotes, createNote } = useNotes();
  const { mode, toggleColorMode, accentKey, setAccentKey, palette } = useAppTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEscapeKey(() => setDrawerOpen(false), drawerOpen);

  const handleNewNote = async () => {
    const note = await createNote();
    if (note?.id) navigate(`/note/${note.id}`);
  };

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <header
        className="no-print"
        style={{
          display: 'none', // shown via media query in css
          position: 'sticky',
          top: 0,
          zIndex: 150,
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 18px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        id="mobile-top-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            className="ns-btn ns-btn-ghost"
            style={{ padding: 6 }}
          >
            <Menu size={20} />
          </button>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>⚡</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--foreground)' }}>NoteStack</span>
          </div>
        </div>

        <button
          onClick={handleNewNote}
          className="ns-btn ns-btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>Note</span>
        </button>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {drawerOpen && (
        <div className="ns-modal-overlay" onClick={() => setDrawerOpen(false)} style={{ padding: 0 }}>
          <div
            className="ns-dialog"
            style={{
              width: 310,
              maxWidth: '85vw',
              height: '100vh',
              maxHeight: '100vh',
              borderRadius: '0 var(--radius-xl) var(--radius-xl) 0',
              padding: '24px 20px',
              animation: 'nsFadeIn 180ms ease-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header & User Profile */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent)',
                      color: '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>NoteStack</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {currentTeam ? currentTeam.name : 'Personal Workspace'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{ color: 'var(--muted-foreground)', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Identity Chip */}
              {currentUser && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-container)',
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {(userProfile?.fullName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0, flexGrow: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userProfile?.fullName || userProfile?.username || 'User'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              )}

              {/* Drawer Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                  onClick={() => {
                    navigate('/notes');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <FileText size={18} style={{ color: 'var(--accent)' }} />
                  <span>All Notes ({activeNotes.length})</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/recent');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Clock size={18} />
                  <span>Recent Notes</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/favorites');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Star size={18} style={{ color: '#f59e0b' }} />
                  <span>Favorites ({favoriteNotes.length})</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/pinned');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Pin size={18} />
                  <span>Pinned Notes</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/folders');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Folder size={18} />
                  <span>Folders ({folders.length})</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/tags');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Tag size={18} />
                  <span>Tags ({tags.length})</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/trash');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Trash2 size={18} />
                  <span>Trash ({trashNotes.length})</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setDrawerOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ padding: '10px 14px' }}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 20 }}>
              {/* Accent Color Palette Selector */}
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: 8 }}>
                  Accent Color
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(palette).map(([k, p]) => {
                    const isSelected = accentKey === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setAccentKey(k)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: p.accent,
                          border: isSelected ? '2px solid var(--foreground)' : '2px solid transparent',
                          cursor: 'pointer',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform var(--transition-fast)',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        }}
                        title={k.toUpperCase()}
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>Theme Mode</span>
                <button
                  onClick={toggleColorMode}
                  className="ns-btn ns-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
                className="ns-btn ns-btn-danger"
                style={{ width: '100%', padding: '10px 0', fontSize: '0.88rem' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Mobile Bottom Navigation Dock */}
      <nav
        className="no-print"
        style={{
          display: 'none', // toggled by media query in index.css
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          background: 'var(--surface)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '6px 16px calc(6px + env(safe-area-inset-bottom, 0px))',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        id="mobile-bottom-nav"
      >
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className="mobile-nav-item"
          style={{
            color: location.pathname === '/' ? 'var(--accent)' : 'var(--muted-foreground)',
          }}
        >
          <Home size={20} />
          <span style={{ fontSize: '0.72rem', fontWeight: location.pathname === '/' ? 700 : 500 }}>Home</span>
        </button>

        {/* All Notes */}
        <button
          onClick={() => navigate('/notes')}
          className="mobile-nav-item"
          style={{
            color: location.pathname === '/notes' ? 'var(--accent)' : 'var(--muted-foreground)',
          }}
        >
          <FileText size={20} />
          <span style={{ fontSize: '0.72rem', fontWeight: location.pathname === '/notes' ? 700 : 500 }}>Notes</span>
        </button>

        {/* Center Floating Action Button: Quick Create Note */}
        <button
          onClick={handleNewNote}
          className="mobile-nav-fab"
          title="Create New Note"
          aria-label="Create New Note"
        >
          <Plus size={24} />
        </button>

        {/* Search */}
        <button
          onClick={onOpenCommandPalette}
          className="mobile-nav-item"
          style={{
            color: 'var(--muted-foreground)',
          }}
        >
          <Search size={20} />
          <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Search</span>
        </button>

        {/* More Drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="mobile-nav-item"
          style={{
            color: drawerOpen ? 'var(--accent)' : 'var(--muted-foreground)',
          }}
        >
          <MoreHorizontal size={20} />
          <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>More</span>
        </button>
      </nav>
    </>
  );
}
