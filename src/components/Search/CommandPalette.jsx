import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FilePlus,
  FolderPlus,
  Star,
  Clock,
  Settings,
  Moon,
  Sun,
  X,
  FileText,
  Share2,
  Download
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useAppTheme } from '../../context/ThemeContext';
import EmptySearch from '../Illustrations/EmptySearch';

export default function CommandPalette({ open, onClose, onToggleSidebar, activeNote, onOpenShare, onOpenExport }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { activeNotes, recentNotes, createNote } = useNotes();
  const { mode, toggleColorMode } = useAppTheme();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search filtering
  const filteredNotes = query.trim()
    ? activeNotes.filter((note) => {
        const q = query.toLowerCase();
        const titleMatch = (note.title || '').toLowerCase().includes(q);
        const textMatch = (note.plainText || '').toLowerCase().includes(q);
        const tagMatch = (note.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || textMatch || tagMatch;
      }).slice(0, 8)
    : [];

  // Default Action Commands
  const staticCommands = [
    {
      id: 'cmd-new-note',
      label: 'Create new note',
      icon: FilePlus,
      shortcut: 'Ctrl+N',
      action: async () => {
        const note = await createNote();
        if (note?.id) navigate(`/note/${note.id}`);
        onClose();
      },
    },
    {
      id: 'cmd-new-folder',
      label: 'Create folder',
      icon: FolderPlus,
      shortcut: 'Ctrl+Shift+N',
      action: () => {
        navigate('/folders');
        onClose();
      },
    },
    {
      id: 'cmd-favorites',
      label: 'Open favorites',
      icon: Star,
      action: () => {
        navigate('/favorites');
        onClose();
      },
    },
    {
      id: 'cmd-recent',
      label: 'Open recent notes',
      icon: Clock,
      action: () => {
        navigate('/recent');
        onClose();
      },
    },
    {
      id: 'cmd-toggle-theme',
      label: `Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: mode === 'dark' ? Sun : Moon,
      action: () => {
        toggleColorMode();
        onClose();
      },
    },
    {
      id: 'cmd-settings',
      label: 'Open settings',
      icon: Settings,
      action: () => {
        navigate('/settings');
        onClose();
      },
    },
  ];

  if (activeNote) {
    if (onOpenShare) {
      staticCommands.push({
        id: 'cmd-share-note',
        label: 'Share current note',
        icon: Share2,
        action: () => {
          onClose();
          onOpenShare();
        },
      });
    }
    if (onOpenExport) {
      staticCommands.push({
        id: 'cmd-export-note',
        label: 'Export current note',
        icon: Download,
        action: () => {
          onClose();
          onOpenExport();
        },
      });
    }
  }

  // Combined selectable items
  const selectableItems = query.trim()
    ? [
        ...filteredNotes.map((n) => ({
          type: 'note',
          id: n.id,
          label: n.title || 'Untitled Note',
          icon: n.icon || '📝',
          preview: (n.plainText || '').substring(0, 70),
          action: () => {
            navigate(`/note/${n.id}`);
            onClose();
          },
        })),
        ...staticCommands.filter((c) =>
          c.label.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : [
        ...staticCommands,
        ...recentNotes.slice(0, 5).map((n) => ({
          type: 'recent_note',
          id: n.id,
          label: n.title || 'Untitled Note',
          icon: n.icon || '📝',
          preview: (n.plainText || '').substring(0, 60),
          action: () => {
            navigate(`/note/${n.id}`);
            onClose();
          },
        })),
      ];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, selectableItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, selectableItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectableItems[selectedIndex]) {
        selectableItems[selectedIndex].action();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 580, maxHeight: 520, borderRadius: 'var(--radius-xl)' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, tags, commands... (Ctrl+K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--foreground)',
            }}
          />
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results / Commands List */}
        <div style={{ overflowY: 'auto', padding: '12px 10px', flexGrow: 1 }}>
          {selectableItems.length === 0 ? (
            <div
              style={{
                padding: '24px 20px',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <EmptySearch size={140} />
              <div style={{ marginTop: 10, fontSize: '0.92rem', fontWeight: 600, color: 'var(--foreground)' }}>
                No results found
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: 4 }}>
                No matching notes or commands found for "{query}".
              </div>
            </div>
          ) : (
            <div>
              {!query.trim() && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--muted-foreground)',
                    padding: '8px 12px 4px',
                  }}
                >
                  Quick Actions
                </div>
              )}
              {selectableItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = item.icon && typeof item.icon !== 'string' ? item.icon : null;
                const isEmoji = typeof item.icon === 'string';

                return (
                  <div
                    key={item.id || item.label + idx}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--surface-container-high)' : 'transparent',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    {isEmoji ? (
                      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon}</span>
                    ) : IconComponent ? (
                      <IconComponent size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    ) : (
                      <FileText size={18} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    )}

                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: 'var(--foreground)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.label}
                      </div>
                      {item.preview && (
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--muted-foreground)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.preview}
                        </div>
                      )}
                    </div>

                    {item.shortcut && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: 'var(--muted-foreground)',
                          background: 'var(--surface-container)',
                          padding: '3px 8px',
                          borderRadius: 6,
                          boxShadow: 'var(--elevation-2)',
                        }}
                      >
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--muted-foreground)',
          }}
        >
          <span>
            Navigate with <kbd>↑</kbd> <kbd>↓</kbd>
          </span>
          <span>
            Select with <kbd>↵</kbd>
          </span>
          <span>
            Close with <kbd>esc</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
