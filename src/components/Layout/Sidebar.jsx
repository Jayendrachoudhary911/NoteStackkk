import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  Star,
  Pin,
  Folder,
  Tag,
  Trash2,
  Settings,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  User,
  MoreHorizontal,
  Users,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { useNotes } from '../../context/NotesContext';
import { useAppTheme } from '../../context/ThemeContext';
import NoteMenu from '../Notes/NoteMenu';
import RenameNoteModal from '../Notes/RenameNoteModal';
import MoveToFolderModal from '../Notes/MoveToFolderModal';
import ShareModal from '../Notes/ShareModal';
import ExportMenu from '../Notes/ExportMenu';
import CreateTeamModal from '../Teams/CreateTeamModal';
import TeamSettingsModal from '../Teams/TeamSettingsModal';

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  onOpenCommandPalette,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const {
    activeNotes,
    recentNotes,
    favoriteNotes,
    pinnedNotes,
    trashNotes,
    folders,
    tags,
    createNote,
    toggleFavorite,
    togglePinned,
    archiveNote,
    softDeleteNote,
    duplicateNote,
  } = useNotes();
  const { mode, toggleColorMode } = useAppTheme();
  const { teams, currentTeam, switchTeam } = useTeam();

  // Profile and workspace popup state
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [teamSettingsModalOpen, setTeamSettingsModalOpen] = useState(false);

  // Note Tree Menu state
  const [treeMenuOpenNoteId, setTreeMenuOpenNoteId] = useState(null);

  // Modals for tree note actions
  const [renameModalNote, setRenameModalNote] = useState(null);
  const [moveModalNote, setMoveModalNote] = useState(null);
  const [shareModalNote, setShareModalNote] = useState(null);
  const [exportModalNote, setExportModalNote] = useState(null);

  const handleNewNote = async () => {
    const note = await createNote();
    if (note?.id) navigate(`/note/${note.id}`);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'All Notes', path: '/notes', icon: FileText, count: activeNotes.length },
    { label: 'Recent', path: '/recent', icon: Clock },
    { label: 'Favorites', path: '/favorites', icon: Star, count: favoriteNotes.length },
    { label: 'Pinned', path: '/pinned', icon: Pin, count: pinnedNotes.length },
  ];

  const organizeItems = [
    { label: 'Folders', path: '/folders', icon: Folder, count: folders.length },
    { label: 'Tags', path: '/tags', icon: Tag, count: tags.length },
  ];

  const systemItems = [
    { label: 'Trash', path: '/trash', icon: Trash2, count: trashNotes.length },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const userDisplayName = userProfile?.fullName || currentUser?.displayName || 'User';
  const userInitials = userDisplayName.charAt(0).toUpperCase();

  return (
    <>
      <aside
        style={{
          width: isCollapsed ? 76 : 280,
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 200,
          background: 'var(--surface)',
          boxShadow: 'var(--elevation-1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-normal)',
          userSelect: 'none',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header: App Logo & Collapse Toggle */}
        <div
          style={{
            padding: isCollapsed ? '18px 0' : '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {!isCollapsed && (
            <div
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent)',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: 'var(--elevation-2)',
                }}
              >
                ⚡
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                NoteStack
              </span>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="ns-btn ns-btn-ghost"
            style={{ padding: 6, borderRadius: 'var(--radius-sm)' }}
            title={isCollapsed ? 'Expand sidebar (Ctrl+\\)' : 'Collapse sidebar (Ctrl+\\)'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Workspace / Team Switcher */}
        <div style={{ padding: isCollapsed ? '10px 12px 2px' : '10px 16px 2px', position: 'relative' }}>
          <button
            onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
            className="ns-btn ns-btn-ghost"
            style={{
              width: '100%',
              padding: isCollapsed ? '8px 0' : '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-container)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              gap: 8,
            }}
            title={currentTeam ? `Team Workspace: ${currentTeam.name}` : 'Personal Workspace'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: isCollapsed ? '1.2rem' : '1rem' }}>
                {currentTeam ? (currentTeam.icon || '👥') : '👤'}
              </span>
              {!isCollapsed && (
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTeam ? currentTeam.name : 'Personal'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                    {currentTeam ? `${currentTeam.members?.length || 1} members` : 'Private Workspace'}
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown size={14} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />}
          </button>

          {/* Workspace Popover Menu */}
          {workspaceMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 899 }}
                onClick={() => setWorkspaceMenuOpen(false)}
              />
              <div
                className="ns-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: isCollapsed ? 12 : 16,
                  right: isCollapsed ? undefined : 16,
                  marginTop: 4,
                  minWidth: 220,
                  zIndex: 900,
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted-foreground)', padding: '6px 10px 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Workspaces
                </div>

                {/* Personal Option */}
                <button
                  onClick={() => {
                    switchTeam(null);
                    setWorkspaceMenuOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{
                    fontWeight: !currentTeam ? 700 : 500,
                    color: !currentTeam ? 'var(--accent)' : 'var(--foreground)',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>👤</span>
                  <div style={{ flexGrow: 1, textAlign: 'left' }}>
                    <div>Personal Workspace</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>Private notes</div>
                  </div>
                  {!currentTeam && <Check size={14} />}
                </button>

                {/* Teams List */}
                {teams.map((t) => {
                  const isSelected = currentTeam?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTeam(t);
                        setWorkspaceMenuOpen(false);
                      }}
                      className="ns-menu-item"
                      style={{
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? 'var(--accent)' : 'var(--foreground)',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{t.icon || '👥'}</span>
                      <div style={{ flexGrow: 1, textAlign: 'left', minWidth: 0 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>{t.members?.length || 1} members</div>
                      </div>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                {/* Team Actions */}
                {currentTeam && (
                  <button
                    onClick={() => {
                      setTeamSettingsModalOpen(true);
                      setWorkspaceMenuOpen(false);
                    }}
                    className="ns-menu-item"
                  >
                    <Users size={14} style={{ color: 'var(--accent)' }} />
                    <span>Team Members & Settings</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setCreateTeamModalOpen(true);
                    setWorkspaceMenuOpen(false);
                  }}
                  className="ns-menu-item"
                  style={{ color: 'var(--accent)', fontWeight: 600 }}
                >
                  <Plus size={14} />
                  <span>Create New Team</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Primary Action Buttons: New Note & Search */}
        <div style={{ padding: isCollapsed ? '16px 12px' : '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleNewNote}
            className="ns-btn ns-btn-primary"
            style={{
              width: '100%',
              padding: isCollapsed ? '10px 0' : '10px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 10,
            }}
            title="Create new note (Ctrl+N)"
          >
            <Plus size={18} />
            {!isCollapsed && <span style={{ fontWeight: 700 }}>New Note</span>}
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="ns-btn ns-btn-secondary"
            style={{
              width: '100%',
              padding: isCollapsed ? '8px 0' : '8px 12px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              color: 'var(--muted-foreground)',
              fontSize: '0.85rem',
            }}
            title="Search notes (Ctrl+K)"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={15} />
              {!isCollapsed && <span>Search...</span>}
            </div>
            {!isCollapsed && (
              <span
                style={{
                  fontSize: '0.7rem',
                  background: 'var(--surface-container-high)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                Ctrl+K
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: isCollapsed ? '8px 8px' : '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Section: Workspace */}
          <div>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted-foreground)',
                  padding: '4px 12px',
                  marginBottom: 2,
                }}
              >
                Workspace
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--surface-container-high)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--foreground)',
                      boxShadow: isActive ? 'var(--elevation-2)' : 'none',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      transition: 'all var(--transition-fast)',
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <IconComponent size={18} style={{ flexShrink: 0 }} />
                    {!isCollapsed && (
                      <>
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: 10,
                              background: 'var(--surface-container)',
                              color: 'var(--muted-foreground)',
                            }}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Organize */}
          <div>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted-foreground)',
                  padding: '4px 12px',
                  marginBottom: 2,
                }}
              >
                Organize
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {organizeItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--surface-container-high)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--foreground)',
                      boxShadow: isActive ? 'var(--elevation-2)' : 'none',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      transition: 'all var(--transition-fast)',
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <IconComponent size={18} style={{ flexShrink: 0 }} />
                    {!isCollapsed && (
                      <>
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: 10,
                              background: 'var(--surface-container)',
                              color: 'var(--muted-foreground)',
                            }}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Dynamic Sidebar Note Tree */}
          {!isCollapsed && recentNotes.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted-foreground)',
                  padding: '4px 12px',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Recent Notes</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentNotes.slice(0, 6).map((note) => {
                  const isCurrent = location.pathname === `/note/${note.id}`;
                  const isMenuOpen = treeMenuOpenNoteId === note.id;

                  return (
                    <div
                      key={note.id}
                      onClick={() => navigate(`/note/${note.id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        background: isCurrent ? 'var(--surface-container-high)' : 'transparent',
                        color: isCurrent ? 'var(--accent)' : 'var(--foreground)',
                        fontSize: '0.86rem',
                        position: 'relative',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        const moreBtn = e.currentTarget.querySelector('.tree-more-btn');
                        if (moreBtn) moreBtn.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        const moreBtn = e.currentTarget.querySelector('.tree-more-btn');
                        if (moreBtn && !isMenuOpen) moreBtn.style.opacity = '0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flexGrow: 1 }}>
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{note.icon || '📝'}</span>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: isCurrent ? 700 : 500,
                          }}
                        >
                          {note.title || 'Untitled'}
                        </span>
                      </div>

                      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="tree-more-btn"
                          onClick={() => setTreeMenuOpenNoteId(isMenuOpen ? null : note.id)}
                          style={{
                            opacity: isMenuOpen ? 1 : 0,
                            padding: 2,
                            borderRadius: 4,
                            color: 'var(--muted-foreground)',
                            transition: 'opacity var(--transition-fast)',
                          }}
                          title="Note options"
                        >
                          <MoreHorizontal size={14} />
                        </button>

                        {isMenuOpen && (
                          <NoteMenu
                            note={note}
                            onOpen={() => navigate(`/note/${note.id}`)}
                            onRename={(n) => setRenameModalNote(n)}
                            onDuplicate={duplicateNote}
                            onMove={(n) => setMoveModalNote(n)}
                            onToggleFavorite={toggleFavorite}
                            onTogglePin={togglePinned}
                            onArchive={archiveNote}
                            onShare={(n) => setShareModalNote(n)}
                            onExport={(n) => setExportModalNote(n)}
                            onDelete={softDeleteNote}
                            onClose={() => setTreeMenuOpenNoteId(null)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: System (Trash, Settings) */}
          <div style={{ marginTop: 'auto' }}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--muted-foreground)',
                  padding: '4px 12px',
                  marginBottom: 2,
                }}
              >
                System
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {systemItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--surface-container-high)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--foreground)',
                      boxShadow: isActive ? 'var(--elevation-2)' : 'none',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      transition: 'all var(--transition-fast)',
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <IconComponent size={18} style={{ flexShrink: 0 }} />
                    {!isCollapsed && (
                      <>
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: 10,
                              background: 'var(--surface-container)',
                              color: 'var(--muted-foreground)',
                            }}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User Profile Area & Theme Switcher */}
        <div
          style={{
            padding: isCollapsed ? '14px 10px' : '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          <div
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: profileMenuOpen ? 'var(--surface-container-high)' : 'transparent',
              transition: 'background var(--transition-fast)',
            }}
          >
            {/* User Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                flexShrink: 0,
              }}
            >
              {userInitials}
            </div>

            {!isCollapsed && (
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userDisplayName}
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--muted-foreground)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentUser?.email}
                </div>
              </div>
            )}
          </div>

          {/* Profile Popover Menu */}
          {profileMenuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 899 }}
                onClick={() => setProfileMenuOpen(false)}
              />
              <div
                className="ns-menu"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 12,
                  marginBottom: 8,
                  minWidth: 220,
                }}
              >
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileMenuOpen(false);
                  }}
                  className="ns-menu-item"
                >
                  <User size={15} />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    toggleColorMode();
                    setProfileMenuOpen(false);
                  }}
                  className="ns-menu-item"
                >
                  {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{mode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                </button>

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    logout();
                    setProfileMenuOpen(false);
                  }}
                  className="ns-menu-item danger"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Global Modals Triggered from Sidebar Note Tree */}
      {renameModalNote && (
        <RenameNoteModal
          open={Boolean(renameModalNote)}
          note={renameModalNote}
          onClose={() => setRenameModalNote(null)}
        />
      )}

      {moveModalNote && (
        <MoveToFolderModal
          open={Boolean(moveModalNote)}
          note={moveModalNote}
          onClose={() => setMoveModalNote(null)}
        />
      )}

      {shareModalNote && (
        <ShareModal
          open={Boolean(shareModalNote)}
          note={shareModalNote}
          onClose={() => setShareModalNote(null)}
        />
      )}

      {exportModalNote && (
        <ExportMenu
          open={Boolean(exportModalNote)}
          note={exportModalNote}
          onClose={() => setExportModalNote(null)}
        />
      )}

      {/* Team Modals */}
      <CreateTeamModal
        open={createTeamModalOpen}
        onClose={() => setCreateTeamModalOpen(false)}
      />

      {currentTeam && (
        <TeamSettingsModal
          open={teamSettingsModalOpen}
          team={currentTeam}
          onClose={() => setTeamSettingsModalOpen(false)}
        />
      )}
    </>
  );
}
