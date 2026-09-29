import React from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Pin,
  Folder,
  Tag,
  ArrowUpDown,
  Archive
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

export default function NoteFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterChange,
  selectedFolderId,
  onFolderChange,
  selectedTag,
  onTagChange,
  viewMode,
  onViewModeChange,
  showArchivedToggle = true,
}) {
  const { folders, tags } = useNotes();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
      {/* Top Controls: Search, Sort, View Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface-container)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            flexGrow: 1,
            maxWidth: 380,
            boxShadow: 'var(--elevation-2)',
          }}
        >
          <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Filter notes by title or text..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              color: 'var(--foreground)',
              width: '100%',
            }}
          />
        </div>

        {/* Right side: Sort and View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Sort Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--surface-container)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            <ArrowUpDown size={15} style={{ color: 'var(--muted-foreground)' }} />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--foreground)',
                cursor: 'pointer',
              }}
            >
              <option value="modified_desc" style={{ background: 'var(--surface)' }}>Recently Modified</option>
              <option value="created_desc" style={{ background: 'var(--surface)' }}>Recently Created</option>
              <option value="alpha_asc" style={{ background: 'var(--surface)' }}>Alphabetical (A-Z)</option>
              <option value="alpha_desc" style={{ background: 'var(--surface)' }}>Alphabetical (Z-A)</option>
              <option value="modified_asc" style={{ background: 'var(--surface)' }}>Oldest First</option>
            </select>
          </div>

          {/* Grid vs List View Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-container)',
              padding: 3,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            <button
              onClick={() => onViewModeChange('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'grid' ? 'var(--surface-container-high)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent)' : 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'list' ? 'var(--surface-container-high)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent)' : 'var(--muted-foreground)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => onFilterChange('all')}
          className="ns-btn"
          style={{
            padding: '5px 12px',
            fontSize: '0.8rem',
            background: filterType === 'all' && !selectedFolderId && !selectedTag ? 'var(--accent)' : 'var(--surface-container)',
            color: filterType === 'all' && !selectedFolderId && !selectedTag ? '#09090b' : 'var(--foreground)',
          }}
        >
          All
        </button>

        <button
          onClick={() => onFilterChange(filterType === 'favorites' ? 'all' : 'favorites')}
          className="ns-btn"
          style={{
            padding: '5px 12px',
            fontSize: '0.8rem',
            background: filterType === 'favorites' ? '#f5d397' : 'var(--surface-container)',
            color: filterType === 'favorites' ? '#271900' : 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Star size={13} style={{ fill: filterType === 'favorites' ? '#271900' : 'none' }} />
          Favorites
        </button>

        <button
          onClick={() => onFilterChange(filterType === 'pinned' ? 'all' : 'pinned')}
          className="ns-btn"
          style={{
            padding: '5px 12px',
            fontSize: '0.8rem',
            background: filterType === 'pinned' ? 'var(--accent)' : 'var(--surface-container)',
            color: filterType === 'pinned' ? '#09090b' : 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Pin size={13} style={{ fill: filterType === 'pinned' ? '#09090b' : 'none' }} />
          Pinned
        </button>

        {showArchivedToggle && (
          <button
            onClick={() => onFilterChange(filterType === 'archived' ? 'all' : 'archived')}
            className="ns-btn"
            style={{
              padding: '5px 12px',
              fontSize: '0.8rem',
              background: filterType === 'archived' ? 'var(--surface-container-high)' : 'var(--surface-container)',
              color: filterType === 'archived' ? 'var(--accent)' : 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Archive size={13} />
            Archived
          </button>
        )}

        {/* Folder filter dropdown */}
        {folders.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: selectedFolderId ? 'var(--surface-container-high)' : 'var(--surface-container)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            <Folder size={13} style={{ color: 'var(--accent)' }} />
            <select
              value={selectedFolderId || ''}
              onChange={(e) => onFolderChange(e.target.value || null)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
                color: 'var(--foreground)',
                cursor: 'pointer',
              }}
            >
              <option value="" style={{ background: 'var(--surface)' }}>All Folders</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id} style={{ background: 'var(--surface)' }}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tag filter dropdown */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: selectedTag ? 'var(--surface-container-high)' : 'var(--surface-container)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            <Tag size={13} style={{ color: 'var(--accent)' }} />
            <select
              value={selectedTag || ''}
              onChange={(e) => onTagChange(e.target.value || null)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.8rem',
                color: 'var(--foreground)',
                cursor: 'pointer',
              }}
            >
              <option value="" style={{ background: 'var(--surface)' }}>All Tags</option>
              {tags.map((t) => (
                <option key={t.id} value={t.name} style={{ background: 'var(--surface)' }}>
                  #{t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
