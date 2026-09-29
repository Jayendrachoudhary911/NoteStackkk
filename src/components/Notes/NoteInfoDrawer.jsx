import React from 'react';
import {
  Info,
  Calendar,
  Clock,
  Globe,
  Lock,
  X
} from 'lucide-react';
import { formatFullDateTime } from '../../utils/formatDate';
import { useNotes } from '../../context/NotesContext';

import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function NoteInfoDrawer({ open, onClose, note, isShared }) {
  const { folders } = useNotes();

  useEscapeKey(onClose, open);

  if (!open || !note) return null;

  const folder = folders.find((f) => f.id === note.folderId);
  const plainText = note.plainText || '';
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;
  const sentenceCount = (plainText.match(/[.!?]+/g) || []).length || (wordCount > 0 ? 1 : 0);
  const paragraphCount = plainText.split(/\n\s*\n/).filter(Boolean).length || (wordCount > 0 ? 1 : 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const commentCount = Array.isArray(note.comments) ? note.comments.length : 0;
  const mediaCount = Array.isArray(note.mediaLinks) ? note.mediaLinks.length : 0;

  return (
    <div className="ns-drawer-overlay" onClick={onClose}>
      <div
        className="ns-drawer"
        style={{ padding: 24, width: 340, maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Info size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Note Overview</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', flexGrow: 1 }}>
          {/* Note Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{note.icon || '📝'}</span>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{note.title || 'Untitled Note'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                {folder ? `Folder: ${folder.name}` : 'Uncategorized'}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Reading Time Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-container-high)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: 600 }}>Reading Time</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
              ~{readingTime} min
            </span>
          </div>

          {/* Statistics Grid */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted-foreground)',
                marginBottom: 10,
              }}
            >
              Document Statistics
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              <div
                style={{
                  background: 'var(--surface-container-high)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>
                  Words
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{wordCount}</div>
              </div>

              <div
                style={{
                  background: 'var(--surface-container-high)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>
                  Characters
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{charCount}</div>
              </div>

              <div
                style={{
                  background: 'var(--surface-container-high)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>
                  Sentences
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{sentenceCount}</div>
              </div>

              <div
                style={{
                  background: 'var(--surface-container-high)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: 2 }}>
                  Paragraphs
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{paragraphCount}</div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Collaboration & Media Metrics */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted-foreground)',
                marginBottom: 10,
              }}
            >
              Collaboration & Assets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container)',
                }}
              >
                <span>💬 Inline Comments</span>
                <span style={{ fontWeight: 700, color: commentCount > 0 ? '#f59e0b' : 'var(--muted-foreground)' }}>
                  {commentCount}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container)',
                }}
              >
                <span>📎 Media / Videos</span>
                <span style={{ fontWeight: 700, color: mediaCount > 0 ? 'var(--accent)' : 'var(--muted-foreground)' }}>
                  {mediaCount}
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Dates Metadata */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted-foreground)',
                marginBottom: 12,
              }}
            >
              Metadata
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Created</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 500 }}>
                    {formatFullDateTime(note.createdAt)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Clock size={16} style={{ color: 'var(--muted-foreground)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Last Modified</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 500 }}>
                    {formatFullDateTime(note.updatedAt)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isShared ? (
                  <Globe size={16} style={{ color: 'var(--accent)' }} />
                ) : (
                  <Lock size={16} style={{ color: 'var(--muted-foreground)' }} />
                )}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Sharing</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 500 }}>
                    {isShared ? 'Public Link' : 'Private'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {Array.isArray(note.tags) && note.tags.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--muted-foreground)',
                  marginBottom: 10,
                }}
              >
                Tags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {note.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      background: 'var(--surface-container-high)',
                      padding: '4px 8px',
                      borderRadius: 6,
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
