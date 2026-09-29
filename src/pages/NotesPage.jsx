import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import NoteFilters from '../components/Notes/NoteFilters';
import NoteGrid from '../components/Notes/NoteGrid';
import NoteList from '../components/Notes/NoteList';
import ShareModal from '../components/Notes/ShareModal';
import ExportMenu from '../components/Notes/ExportMenu';
import MoveToFolderModal from '../components/Notes/MoveToFolderModal';
import RenameNoteModal from '../components/Notes/RenameNoteModal';
import EmptyNotes from '../components/Illustrations/EmptyNotes';
import EmptyState from '../components/UI/EmptyState';
import { NoteCardSkeleton } from '../components/UI/Skeleton';

export default function NotesPage() {
  const navigate = useNavigate();
  const { notes, loading, createNote } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('modified_desc');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'favorites' | 'pinned' | 'archived'
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals
  const [shareNote, setShareNote] = useState(null);
  const [exportNote, setExportNote] = useState(null);
  const [moveNoteTarget, setMoveNoteTarget] = useState(null);
  const [renameNoteTarget, setRenameNoteTarget] = useState(null);

  const handleCreateNote = async () => {
    const note = await createNote();
    if (note?.id) navigate(`/note/${note.id}`);
  };

  // Filter and Sort Logic
  const filteredAndSortedNotes = useMemo(() => {
    let result = notes.filter((n) => !n.isDeleted);

    // Filter by type
    if (filterType === 'favorites') {
      result = result.filter((n) => n.isFavorite && !n.isArchived);
    } else if (filterType === 'pinned') {
      result = result.filter((n) => n.isPinned && !n.isArchived);
    } else if (filterType === 'archived') {
      result = result.filter((n) => n.isArchived);
    } else {
      // 'all' excludes archived unless explicitly requested
      result = result.filter((n) => !n.isArchived);
    }

    // Filter by folder
    if (selectedFolderId) {
      result = result.filter((n) => n.folderId === selectedFolderId);
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((n) => (n.tags || []).includes(selectedTag));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const textMatch = (n.plainText || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || textMatch || tagMatch;
      });
    }

    // Sort
    result.sort((a, b) => {
      const getMillis = (ts) => (ts?.toMillis ? ts.toMillis() : 0);

      if (sortBy === 'modified_desc') {
        return getMillis(b.updatedAt) - getMillis(a.updatedAt);
      }
      if (sortBy === 'modified_asc') {
        return getMillis(a.updatedAt) - getMillis(b.updatedAt);
      }
      if (sortBy === 'created_desc') {
        return getMillis(b.createdAt) - getMillis(a.createdAt);
      }
      if (sortBy === 'alpha_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'alpha_desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    return result;
  }, [notes, filterType, selectedFolderId, selectedTag, searchQuery, sortBy]);

  if (loading) {
    return (
      <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          <NoteCardSkeleton />
          <NoteCardSkeleton />
          <NoteCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            All Notes
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
            Showing {filteredAndSortedNotes.length} note{filteredAndSortedNotes.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="ns-btn ns-btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.92rem' }}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>
      </div>

      {/* Filters, Search, Sort & View Controls */}
      <NoteFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterType={filterType}
        onFilterChange={setFilterType}
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Notes Grid or List */}
      {filteredAndSortedNotes.length === 0 ? (
        <EmptyState
          illustration={<EmptyNotes size={180} />}
          title={searchQuery.trim() ? 'No matching notes found' : 'No notes in this view'}
          description={
            searchQuery.trim()
              ? `We couldn't find any notes matching "${searchQuery}". Try different keywords or reset filters.`
              : 'Create your first note or change your active filters.'
          }
          actionLabel="Create Note"
          actionIcon={Plus}
          onAction={handleCreateNote}
        />
      ) : viewMode === 'grid' ? (
        <NoteGrid
          notes={filteredAndSortedNotes}
          onShare={(n) => setShareNote(n)}
          onExport={(n) => setExportNote(n)}
          onMove={(n) => setMoveNoteTarget(n)}
          onRename={(n) => setRenameNoteTarget(n)}
        />
      ) : (
        <NoteList
          notes={filteredAndSortedNotes}
          onShare={(n) => setShareNote(n)}
          onExport={(n) => setExportNote(n)}
          onMove={(n) => setMoveNoteTarget(n)}
          onRename={(n) => setRenameNoteTarget(n)}
        />
      )}

      {/* Modals */}
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
