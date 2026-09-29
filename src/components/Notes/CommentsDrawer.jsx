import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
  Quote,
  CornerDownRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addNoteComment, deleteNoteComment, toggleResolveNoteComment } from '../../firebase/notes';
import { formatRelativeTime } from '../../utils/formatDate';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function CommentsDrawer({
  open,
  onClose,
  note,
  activeAnchor,
  onClearAnchor,
  onCommentClick,
  customAddComment,
  customDeleteComment,
  customToggleResolve
}) {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unresolved' | 'resolved'

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (!open) {
      setCommentText('');
    }
  }, [open]);

  if (!open || !note) return null;

  const comments = Array.isArray(note.comments) ? note.comments : [];
  const filteredComments = comments.filter((c) => {
    if (filter === 'unresolved') return !c.resolved;
    if (filter === 'resolved') return Boolean(c.resolved);
    return true;
  });

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        userId: currentUser?.uid || 'guest-' + Math.random().toString(36).substr(2, 6),
        authorName: userProfile?.fullName || currentUser?.displayName || 'NoteStack User',
        authorPhoto: currentUser?.photoURL || null,
        text: commentText.trim(),
        blockId: activeAnchor?.blockId || null,
        selectedText: activeAnchor?.selectedText || null,
      };

      if (customAddComment) {
        await customAddComment(payload);
      } else {
        await addNoteComment(note.id, payload);
      }

      setCommentText('');
      if (onClearAnchor) onClearAnchor();
      showToast('Comment posted', 'success');
    } catch (err) {
      console.error('Failed to post comment:', err);
      showToast('Error posting comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (customDeleteComment) {
        await customDeleteComment(commentId);
      } else {
        await deleteNoteComment(note.id, commentId, comments);
      }
      showToast('Comment deleted', 'info');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      showToast('Error deleting comment', 'error');
    }
  };

  const handleToggleResolve = async (commentId) => {
    try {
      if (customToggleResolve) {
        await customToggleResolve(commentId);
      } else {
        await toggleResolveNoteComment(note.id, commentId, comments);
      }
    } catch (err) {
      console.error('Failed to toggle comment status:', err);
    }
  };

  return (
    <div className="ns-drawer-overlay" onClick={onClose}>
      <div className="ns-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <MessageSquare size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Note Comments</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '8px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--surface-container-low)',
          }}
        >
          {['all', 'unresolved', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filter === f ? 'var(--surface-container-highest)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--muted-foreground)',
                fontWeight: filter === f ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {filteredComments.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--muted-foreground)',
                textAlign: 'center',
                gap: 12,
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--surface-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={24} style={{ opacity: 0.5 }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {filter === 'all' ? 'No comments yet' : `No ${filter} comments`}
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: 4 }}>
                  Select text or click any section to add inline feedback
                </div>
              </div>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const isAuthor = comment.userId === currentUser?.uid;

              return (
                <div
                  key={comment.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: comment.resolved
                      ? 'var(--surface-container-low)'
                      : 'var(--surface-container)',
                    border: '1px solid var(--border-subtle)',
                    opacity: comment.resolved ? 0.75 : 1,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          color: '#09090b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {(comment.authorName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {comment.authorName || 'Anonymous'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button
                        onClick={() => handleToggleResolve(comment.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: comment.resolved ? 'var(--accent)' : 'var(--muted-foreground)',
                          padding: 4,
                          borderRadius: 4,
                        }}
                        title={comment.resolved ? 'Mark unresolved' : 'Mark resolved'}
                      >
                        {comment.resolved ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                      </button>

                      {isAuthor && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--muted-foreground)',
                            padding: 4,
                            borderRadius: 4,
                          }}
                          title="Delete comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quoted section/selection anchor */}
                  {comment.selectedText && (
                    <div
                      onClick={() => onCommentClick && onCommentClick(comment)}
                      style={{
                        padding: '6px 10px',
                        background: 'var(--surface-container-high)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '3px solid var(--accent)',
                        fontSize: '0.78rem',
                        color: 'var(--foreground)',
                        fontStyle: 'italic',
                        cursor: onCommentClick ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                      title={onCommentClick ? 'Click to jump to section' : undefined}
                    >
                      <Quote size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{comment.selectedText}"
                      </span>
                      {onCommentClick && (
                        <CornerDownRight size={12} style={{ marginLeft: 'auto', opacity: 0.6, flexShrink: 0 }} />
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      color: 'var(--foreground)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      paddingLeft: 34,
                      textDecoration: comment.resolved ? 'line-through' : 'none',
                    }}
                  >
                    {comment.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active Selection / Section Banner */}
        {activeAnchor?.selectedText && (
          <div
            style={{
              padding: '8px 14px',
              background: 'var(--surface-container-highest)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--foreground)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <Quote size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Commenting on: <strong>"{activeAnchor.selectedText}"</strong>
              </span>
            </div>
            {onClearAnchor && (
              <button
                type="button"
                onClick={onClearAnchor}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                  padding: 2,
                }}
                title="Clear selection anchor"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Comment Input Footer */}
        <form
          onSubmit={handleAddComment}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--surface)',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-end',
          }}
        >
          <textarea
            placeholder={
              activeAnchor?.selectedText
                ? 'Comment on this section... (Enter to post)'
                : 'Write a comment... (Enter to post)'
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment(e);
              }
            }}
            rows={2}
            style={{
              flexGrow: 1,
              background: 'var(--surface-container-high)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: '0.85rem',
              color: 'var(--foreground)',
              resize: 'none',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="ns-btn ns-btn-primary"
            style={{
              padding: '10px 14px',
              height: 42,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
