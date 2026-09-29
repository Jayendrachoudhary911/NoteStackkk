import React, { useState } from 'react';
import { Folder, FolderPlus, Plus } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import FolderCard from '../components/Folders/FolderCard';
import FolderDialog from '../components/Folders/FolderDialog';
import EmptyFolder from '../components/Illustrations/EmptyFolder';
import EmptyState from '../components/UI/EmptyState';

export default function FoldersPage() {
  const { folders, activeNotes } = useNotes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Folder size={24} style={{ color: 'var(--accent)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Folders
            </h1>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
            Organize your notes into dedicated spaces and categories
          </p>
        </div>

        <button
          onClick={() => {
            setFolderToEdit(null);
            setDialogOpen(true);
          }}
          className="ns-btn ns-btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.92rem' }}
        >
          <FolderPlus size={18} />
          <span>New Folder</span>
        </button>
      </div>

      {folders.length === 0 ? (
        <EmptyState
          illustration={<EmptyFolder size={180} />}
          title="No folders yet"
          description="Organize your notes into spaces that make sense to you. Create folders for work, personal ideas, or projects."
          actionLabel="Create folder"
          actionIcon={Plus}
          onAction={() => {
            setFolderToEdit(null);
            setDialogOpen(true);
          }}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {folders.map((folder) => {
            const count = activeNotes.filter((n) => n.folderId === folder.id).length;
            return (
              <FolderCard
                key={folder.id}
                folder={folder}
                noteCount={count}
                onEditFolder={(f) => {
                  setFolderToEdit(f);
                  setDialogOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <FolderDialog
        open={dialogOpen}
        folderToEdit={folderToEdit}
        onClose={() => {
          setDialogOpen(false);
          setFolderToEdit(null);
        }}
      />
    </div>
  );
}
