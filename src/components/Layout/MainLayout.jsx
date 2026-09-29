import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import CommandPalette from '../Search/CommandPalette';
import FolderDialog from '../Folders/FolderDialog';
import { useNotes } from '../../context/NotesContext';

export default function MainLayout({ children, activeNote, onOpenShare, onOpenExport }) {
  const navigate = useNavigate();
  const { createNote } = useNotes();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('notestack_sidebar_collapsed') === 'true';
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('notestack_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e) => {
      const isMeta = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd + K: Command Palette
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl/Cmd + N: New Note
      else if (isMeta && !e.shiftKey && e.key.toLowerCase() === 'n') {
        // Prevent default browser new window
        e.preventDefault();
        const note = await createNote();
        if (note?.id) navigate(`/note/${note.id}`);
      }
      // Ctrl/Cmd + Shift + N: New Folder
      else if (isMeta && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setNewFolderModalOpen(true);
      }
      // Ctrl/Cmd + \: Toggle Sidebar
      else if (isMeta && e.key === '\\') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
      // Escape: Close Command Palette
      else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createNote, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Desktop Sidebar (hidden on small screens via CSS) */}
      <div className="desktop-sidebar">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        {/* Mobile Header */}
        <MobileNav onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* Dynamic Page View */}
        <main
          style={{
            flexGrow: 1,
            width: '100%',
            overflowX: 'hidden',
          }}
          className="main-content-scroll"
        >
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleSidebar={toggleSidebarCollapse}
        activeNote={activeNote}
        onOpenShare={onOpenShare}
        onOpenExport={onOpenExport}
      />

      {/* Global New Folder Modal */}
      <FolderDialog
        open={newFolderModalOpen}
        onClose={() => setNewFolderModalOpen(false)}
      />
    </div>
  );
}