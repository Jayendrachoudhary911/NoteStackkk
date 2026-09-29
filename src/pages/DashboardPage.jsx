import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FolderPlus,
  Clock,
  Star,
  Pin,
  Folder,
  PenTool,
  TrendingUp,
  FileCheck,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import FolderCard from '../components/Folders/FolderCard';
import FolderDialog from '../components/Folders/FolderDialog';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyNotes from '../components/Illustrations/EmptyNotes';
import EmptyState from '../components/UI/EmptyState';
import { DashboardSkeleton } from '../components/UI/Skeleton';

export default function DashboardPage({ onOpenCommandPalette }) {
  const navigate = useNavigate();
  const { userProfile, currentUser } = useAuth();
  const {
    activeNotes,
    recentNotes,
    favoriteNotes,
    pinnedNotes,
    folders,
    loading,
    createNote,
    activityStats,
  } = useNotes();

  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  // Modals for note actions
  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Friend';

  // Personalized Greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCreateNote = async () => {
    const note = await createNote();
    if (note?.id) navigate(`/note/${note.id}`);
  };

  if (loading) {
    return (
      <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <DashboardSkeleton />
      </div>
    );
  }

  const hasNotes = activeNotes.length > 0;

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--foreground)',
            letterSpacing: '-0.03em',
            marginBottom: 6,
          }}
        >
          {greeting}, {displayName}
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--muted-foreground)' }}>
          {hasNotes
            ? `You have ${activeNotes.length} note${activeNotes.length !== 1 ? 's' : ''} across ${folders.length} folder${folders.length !== 1 ? 's' : ''}.`
            : 'Capture your thoughts. Organize your ideas.'}
        </p>

        {/* Quick Actions Row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={handleCreateNote}
            className="ns-btn ns-btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.92rem' }}
          >
            <Plus size={18} />
            <span>New Note</span>
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="ns-btn ns-btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.92rem' }}
          >
            <Search size={16} />
            <span>Search Notes</span>
          </button>

          <button
            onClick={() => setNewFolderOpen(true)}
            className="ns-btn ns-btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.92rem' }}
          >
            <FolderPlus size={16} />
            <span>Create Folder</span>
          </button>
        </div>
      </div>

      {!hasNotes ? (
        <EmptyState
          illustration={<EmptyNotes size={200} />}
          title="No notes yet"
          description="Your ideas are waiting for their first page. Capture meeting items, drafts, or personal notes in an instant."
          actionLabel="Create your first note"
          actionIcon={Plus}
          onAction={handleCreateNote}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Writing Activity Visual Cards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Workspace Activity</h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              <div className="ns-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-foreground)', marginBottom: 8 }}>
                  <PenTool size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Notes Created</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activityStats.totalNotes}</div>
              </div>

              <div className="ns-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-foreground)', marginBottom: 8 }}>
                  <FileCheck size={16} style={{ color: '#8cefcb' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Notes Edited</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activityStats.notesEdited}</div>
              </div>

              <div className="ns-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-foreground)', marginBottom: 8 }}>
                  <TrendingUp size={16} style={{ color: '#f5d397' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Words Written</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activityStats.totalWords}</div>
              </div>

              <div className="ns-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-foreground)', marginBottom: 8 }}>
                  <Calendar size={16} style={{ color: '#c8b6ff' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Active Days</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{activityStats.activeDays}</div>
              </div>
            </div>
          </div>

          {/* Continue Writing / Recent Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Continue Writing</h3>
              </div>
              <button
                onClick={() => navigate('/recent')}
                className="ns-btn ns-btn-ghost"
                style={{ fontSize: '0.82rem', fontWeight: 600 }}
              >
                View all recent →
              </button>
            </div>
            <NoteGrid
              notes={recentNotes.slice(0, 3)}
              onShare={(n) => setShareNote(n)}
              onExport={(n) => setExportNote(n)}
              onMove={(n) => setMoveNoteTarget(n)}
              onRename={(n) => setRenameNoteTarget(n)}
            />
          </div>

          {/* Pinned Notes Section (if any) */}
          {pinnedNotes.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pin size={18} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Pinned Notes</h3>
                </div>
                <button
                  onClick={() => navigate('/pinned')}
                  className="ns-btn ns-btn-ghost"
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  View all pinned →
                </button>
              </div>
              <NoteGrid
                notes={pinnedNotes.slice(0, 3)}
                onShare={(n) => setShareNote(n)}
                onExport={(n) => setExportNote(n)}
                onMove={(n) => setMoveNoteTarget(n)}
                onRename={(n) => setRenameNoteTarget(n)}
              />
            </div>
          )}

          {/* Favorites Section (if any) */}
          {favoriteNotes.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} style={{ color: '#f5d397', fill: '#f5d397' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Favorites</h3>
                </div>
                <button
                  onClick={() => navigate('/favorites')}
                  className="ns-btn ns-btn-ghost"
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  View all favorites →
                </button>
              </div>
              <NoteGrid
                notes={favoriteNotes.slice(0, 3)}
                onShare={(n) => setShareNote(n)}
                onExport={(n) => setExportNote(n)}
                onMove={(n) => setMoveNoteTarget(n)}
                onRename={(n) => setRenameNoteTarget(n)}
              />
            </div>
          )}

          {/* Your Folders Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Folder size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Folders</h3>
              </div>
              <button
                onClick={() => navigate('/folders')}
                className="ns-btn ns-btn-ghost"
                style={{ fontSize: '0.82rem', fontWeight: 600 }}
              >
                View all folders →
              </button>
            </div>

            {folders.length === 0 ? (
              <div
                className="ns-card"
                style={{
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--surface-container-low)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>No folders yet</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                    Organize your workspace notes by category or project
                  </div>
                </div>
                <button
                  onClick={() => setNewFolderOpen(true)}
                  className="ns-btn ns-btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <FolderPlus size={15} />
                  <span>Create Folder</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 16,
                }}
              >
                {folders.slice(0, 4).map((folder) => {
                  const count = activeNotes.filter((n) => n.folderId === folder.id).length;
                  return (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      noteCount={count}
                      onEditFolder={(f) => setEditingFolder(f)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Modals for dashboard actions */}
      <FolderDialog
        open={newFolderOpen || Boolean(editingFolder)}
        folderToEdit={editingFolder}
        onClose={() => {
          setNewFolderOpen(false);
          setEditingFolder(null);
        }}
      />

      {shareNote && (
        <ShareModal
          open={Boolean(shareNote)}
          note={shareNote}
          onClose={() => setShareNote(null)}
        />
      )}

      {exportNote && (
        <ExportMenu
          open={Boolean(exportNote)}
          note={exportNote}
          onClose={() => setExportNote(null)}
        />
      )}

      {moveNoteTarget && (
        <MoveToFolderModal
          open={Boolean(moveNoteTarget)}
          note={moveNoteTarget}
          onClose={() => setMoveNoteTarget(null)}
        />
      )}

      {renameNoteTarget && (
        <RenameNoteModal
          open={Boolean(renameNoteTarget)}
          note={renameNoteTarget}
          onClose={() => setRenameNoteTarget(null)}
        />
      )}
    </div>
  );
}