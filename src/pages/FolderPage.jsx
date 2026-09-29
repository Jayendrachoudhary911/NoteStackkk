import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteGrid from '../components/Notes/NoteGrid';
import FolderDialog from '../components/Folders/FolderDialog';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import EmptyNotes from '../components/Illustrations/EmptyNotes';
import EmptyState from '../components/UI/EmptyState';

export default function FolderPage() {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { folders, activeNotes, createNote, deleteFolder } = useNotes();

  const [editFolderOpen, setEditFolderOpen] = useState(false);
  const [deleteFolderConfirm, setDeleteFolderConfirm] = useState(false);

  // Modals for notes
  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  const folder = folders.find((f) => f.id === folderId);

  const folderNotes = useMemo(() => {
    return activeNotes.filter((n) => n.folderId === folderId);
  }, [activeNotes, folderId]);

  const handleCreateInFolder = async () => {
    const note = await createNote({ folderId });
    if (note?.id) navigate(`/note/${note.id}`);
  };

  const handleDeleteFolder = async () => {
    await deleteFolder(folderId);
    navigate('/folders');
  };

  if (!folder) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Folder not found</h3>
        <button onClick={() => navigate('/folders')} className="ns-btn ns-btn-secondary" style={{ marginTop: 16 }}>
          Back to Folders
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate('/folders')}
          className="ns-btn ns-btn-ghost"
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>All Folders</span>
        </button>
      </div>

      {/* Folder Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{folder.icon || '📁'}</span>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
              {folder.name}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted-foreground)' }}>
              {folderNotes.length} note{folderNotes.length !== 1 ? 's' : ''} in this space
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setEditFolderOpen(true)}
            className="ns-btn ns-btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Edit2 size={15} />
            <span>Rename</span>
          </button>

          <button
            onClick={() => setDeleteFolderConfirm(true)}
            className="ns-btn ns-btn-ghost"
            style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#ef4444' }}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>

          <button
            onClick={handleCreateInFolder}
            className="ns-btn ns-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>New Note Here</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {folderNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyNotes size={180} />}
          title={`No notes in ${folder.name}`}
          description="Create your first note in this folder to organize your thoughts."
          actionLabel="Create Note in Folder"
          actionIcon={Plus}
          onAction={handleCreateInFolder}
        />
      ) : (
        <NoteGrid
          notes={folderNotes}
          onShare={(n) => setShareNote(n)}
          onExport={(n) => setExportNote(n)}
          onMove={(n) => setMoveNoteTarget(n)}
          onRename={(n) => setRenameNoteTarget(n)}
        />
      )}

      {/* Folder Modals */}
      <FolderDialog
        open={editFolderOpen}
        folderToEdit={folder}
        onClose={() => setEditFolderOpen(false)}
      />

      <ConfirmDialog
        open={deleteFolderConfirm}
        title={`Delete folder "${folder.name}"?`}
        description="Notes in this folder will remain safe and move to your main workspace."
        confirmLabel="Delete Folder"
        onConfirm={handleDeleteFolder}
        onCancel={() => setDeleteFolderConfirm(false)}
      />

      {/* Note Modals */}
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
