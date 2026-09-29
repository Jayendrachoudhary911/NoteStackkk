import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import {
  Calendar,
  User,
  ShieldAlert,
  Edit3,
  MessageSquare,
  Check,
  Loader2,
  WifiOff,
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import {
  updatePublicShareContent,
  addShareComment,
  deleteShareComment
} from '../firebase/sharing';
import { formatFullDateTime } from '../utils/formatDate';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { EditorSkeleton } from '../components/UI/Skeleton';
import MediaEmbedList from '../components/Editor/MediaEmbedList';
import CommentsDrawer from '../components/Notes/CommentsDrawer';
import { compressImageToBase64 } from '../utils/imageCompressor';
import { applyCommentHighlights } from '../utils/commentHighlighter';

function SharedNoteContent({ shareData, editable, onContentChange, onCommentClick }) {
  const { mode } = useAppTheme();
  const editorContainerRef = useRef(null);
  const isLocallyEditingRef = useRef(false);
  const localEditingTimerRef = useRef(null);

  const initialContent = useMemo(() => {
    if (!shareData?.content) return undefined;
    try {
      const parsed = typeof shareData.content === 'string' ? JSON.parse(shareData.content) : shareData.content;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [shareData?.content]);

  // Image upload handling with Base64 compression
  const handleImageUpload = async (file) => {
    try {
      const base64 = await compressImageToBase64(file, 1200, 800, 0.8);
      return base64;
    } catch (e) {
      console.error('Failed to compress image:', e);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const editor = useCreateBlockNote({
    initialContent,
    uploadFile: handleImageUpload,
  });

  useEffect(() => {
    if (editor) {
      editor.isEditable = editable;
    }
  }, [editor, editable]);

  // Live remote content reconciliation
  useEffect(() => {
    if (!editor || !shareData?.content) return;
    if (isLocallyEditingRef.current) return;

    try {
      const remoteBlocks = typeof shareData.content === 'string' ? JSON.parse(shareData.content) : shareData.content;
      if (Array.isArray(remoteBlocks) && remoteBlocks.length > 0) {
        const currentDocStr = JSON.stringify(editor.document);
        const remoteDocStr = JSON.stringify(remoteBlocks);
        if (currentDocStr !== remoteDocStr) {
          editor.replaceBlocks(editor.document, remoteBlocks);
        }
      }
    } catch (err) {
      console.warn('Live shared block reconcile error:', err);
    }
  }, [editor, shareData?.content]);

  // Dynamic comment highlights and symbol badges
  useEffect(() => {
    if (!editorContainerRef.current) return;
    const timer = setTimeout(() => {
      applyCommentHighlights(editorContainerRef.current, shareData?.comments || [], onCommentClick);
    }, 250);

    return () => clearTimeout(timer);
  }, [shareData?.comments, shareData?.content, onCommentClick]);

  useEffect(() => {
    if (!editor || !editable || !onContentChange) return;
    const unsub = editor.onChange(() => {
      isLocallyEditingRef.current = true;
      if (localEditingTimerRef.current) clearTimeout(localEditingTimerRef.current);
      localEditingTimerRef.current = setTimeout(() => {
        isLocallyEditingRef.current = false;
      }, 1500);

      onContentChange(editor.document);
    });
    return () => unsub?.();
  }, [editor, editable, onContentChange]);

  return (
    <div ref={editorContainerRef} style={{ minHeight: 300, position: 'relative' }}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        uploadFile={handleImageUpload}
        theme={mode === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}

export default function SharedNotePage() {
  const { shareId } = useParams();
  const { currentUser } = useAuth();
  const { currentTeam } = useTeam();

  const [shareData, setShareData] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'offline' | 'error'

  // Comments & Section Anchors
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState(null);
  const [selectionTooltip, setSelectionTooltip] = useState(null);

  const debounceTimerRef = useRef(null);

  // Subscribe to real-time share document updates
  useEffect(() => {
    if (!shareId) return;
    setLoading(true);

    const shareRef = doc(db, 'shares', shareId);
    const unsub = onSnapshot(
      shareRef,
      (snap) => {
        if (!snap.exists() || !snap.data().isPublic) {
          setError(true);
          setShareData(null);
        } else {
          const data = { id: snap.id, ...snap.data() };
          setShareData(data);
          setTitle((prev) => (prev ? prev : data.title || 'Untitled Note'));
          setError(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe to shared note:', err);
        setError(true);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [shareId]);

  // Floating text selection listener for inline comments
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionTooltip(null);
        return;
      }
      const text = selection.toString().trim();
      if (text.length > 1) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setSelectionTooltip({
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
              text,
            });
          }
        } catch {
          setSelectionTooltip(null);
        }
      } else {
        setSelectionTooltip(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Determine permissions
  const isOwner = currentUser && shareData && shareData.userId === currentUser.uid;
  const isTeamAdmin =
    currentUser &&
    currentTeam &&
    (currentTeam.ownerId === currentUser.uid || currentTeam.adminUids?.includes(currentUser.uid));
  const canEdit = Boolean(shareData?.accessLevel === 'edit' || isOwner || isTeamAdmin);
  const canComment = Boolean(shareData?.allowComments !== false || canEdit);

  // Extract text from blocks
  const extractPlainText = useCallback((blocks) => {
    if (!Array.isArray(blocks)) return '';
    return blocks
      .map((block) => {
        if (Array.isArray(block.content)) {
          return block.content.map((c) => c.text || '').join('');
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }, []);

  // Autosave when editing shared content
  const triggerAutosave = useCallback(
    (newTitle, blocks) => {
      if (!shareId || !canEdit) return;
      if (!navigator.onLine) {
        setSaveStatus('offline');
        return;
      }

      setSaveStatus('saving');

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const plainText = blocks ? extractPlainText(blocks) : shareData?.plainText || '';
          const updates = {
            title: newTitle.trim() || 'Untitled Note',
          };
          if (blocks) {
            updates.content = JSON.stringify(blocks);
            updates.plainText = plainText;
          }

          await updatePublicShareContent(shareId, updates);
          setSaveStatus('saved');
        } catch (err) {
          console.error('Error saving shared note edit:', err);
          setSaveStatus('error');
        }
      }, 900);
    },
    [shareId, canEdit, shareData?.plainText, extractPlainText]
  );

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutosave(val, null);
  };

  const handleContentChange = useCallback(
    (blocks) => {
      triggerAutosave(title, blocks);
    },
    [title, triggerAutosave]
  );

  const handleCommentClick = (comment) => {
    if (comment.selectedText) {
      const editorEl = document.querySelector('.bn-container') || document.body;
      const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes(comment.selectedText)) {
          const parent = node.parentElement;
          if (parent) {
            parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            parent.style.transition = 'background 0.3s ease';
            const orig = parent.style.background;
            parent.style.background = 'rgba(234, 179, 8, 0.35)';
            setTimeout(() => {
              parent.style.background = orig;
            }, 2000);
            break;
          }
        }
      }
    }
  };

  const handleOpenComments = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (text.length > 0) {
      setActiveAnchor({ selectedText: text });
    }
    setCommentsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 840, margin: '60px auto', padding: '0 24px' }}>
        <EditorSkeleton />
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-container-high)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            color: 'var(--muted-foreground)',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
          This note is no longer available.
        </h2>
        <p style={{ color: 'var(--muted-foreground)', maxWidth: 400, marginBottom: 24, lineHeight: 1.5 }}>
          The author has either made this note private or removed it from NoteStack.
        </p>
        <Link to="/" className="ns-btn ns-btn-primary">
          Go to NoteStack
        </Link>
      </div>
    );
  }

  const commentCount = Array.isArray(shareData.comments) ? shareData.comments.length : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              color: '#09090b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--foreground)' }}>NoteStack</span>

          {/* Permission Status Pill */}
          {canEdit ? (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'var(--surface-container-high)',
                padding: '3px 10px',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                border: '1px solid var(--accent)',
              }}
            >
              <Edit3 size={12} />
              <span>Editing Allowed by Owner/Admin</span>
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--muted-foreground)',
                background: 'var(--surface-container)',
                padding: '3px 8px',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Lock size={12} />
              <span>Read-Only View</span>
            </span>
          )}

          {/* Live Autosave Status if editing */}
          {canEdit && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 500,
                color:
                  saveStatus === 'error'
                    ? '#ef4444'
                    : saveStatus === 'offline'
                    ? '#f5d397'
                    : 'var(--muted-foreground)',
                marginLeft: 6,
              }}
            >
              {saveStatus === 'saving' && (
                <>
                  <Loader2 size={12} className="spin" style={{ color: 'var(--accent)' }} />
                  <span>Saving changes...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check size={13} style={{ color: 'var(--accent)' }} />
                  <span>All changes saved</span>
                </>
              )}
              {saveStatus === 'offline' && (
                <>
                  <WifiOff size={12} />
                  <span>Offline</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle size={12} />
                  <span>Save error</span>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Comments Button if comments enabled */}
          {canComment && (
            <button
              onClick={handleOpenComments}
              className="ns-btn ns-btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.82rem', gap: 6 }}
              title="Open Comments"
            >
              <MessageSquare size={15} />
              <span>Comments</span>
              {commentCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  {commentCount}
                </span>
              )}
            </button>
          )}

          <Link to="/" className="ns-btn ns-btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            Open NoteStack
          </Link>
        </div>
      </header>

      {/* Optional Note Cover Banner */}
      {shareData.cover && (
        <div
          style={{
            height: 180,
            width: '100%',
            background: shareData.cover,
          }}
        />
      )}

      {/* Note Document Surface */}
      <main
        style={{
          width: '100%',
          maxWidth: 860,
          margin: '0 auto',
          padding: '40px 24px 80px',
          flexGrow: 1,
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: 16 }}>
          {shareData.icon || '📝'}
        </div>

        {/* Title: Editable input if canEdit is true, else static h1 */}
        {canEdit ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '2.3rem',
              fontWeight: 800,
              color: 'var(--foreground)',
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}
          />
        ) : (
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            {shareData.title || 'Untitled Note'}
          </h1>
        )}

        {/* Author and Date Metadata */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: '0.85rem',
            color: 'var(--muted-foreground)',
            marginBottom: 28,
            paddingBottom: 16,
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={15} />
            <span>Shared by {shareData.authorName || 'Anonymous'}</span>
          </div>
          <div>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={15} />
            <span>{formatFullDateTime(shareData.updatedAt || shareData.sharedAt)}</span>
          </div>

          {canEdit && (
            <>
              <div>•</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontWeight: 600 }}>
                <Sparkles size={13} />
                <span>You can edit this note</span>
              </div>
            </>
          )}

          {Array.isArray(shareData.tags) && shareData.tags.length > 0 && (
            <>
              <div>•</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {shareData.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--accent)',
                      background: 'var(--surface-container-high)',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Embedded Media / Attachments if any */}
        {Array.isArray(shareData.mediaLinks) && shareData.mediaLinks.length > 0 && (
          <MediaEmbedList mediaLinks={shareData.mediaLinks} />
        )}

        {/* Rendered BlockNote Content (Editable if allowed by owner/admin) */}
        <SharedNoteContent
          shareData={shareData}
          editable={canEdit}
          onContentChange={handleContentChange}
          onCommentClick={handleCommentClick}
        />
      </main>

      {/* Floating Selection Comment Action */}
      {canComment && selectionTooltip && (
        <div
          style={{
            position: 'fixed',
            left: selectionTooltip.x,
            top: selectionTooltip.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000,
            background: 'var(--surface-container-highest)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--elevation-3)',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            animation: 'fadeIn 0.15s ease-out',
            color: 'var(--foreground)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            setActiveAnchor({ selectedText: selectionTooltip.text });
            setCommentsDrawerOpen(true);
            setSelectionTooltip(null);
          }}
        >
          <MessageSquare size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Comment on selection</span>
        </div>
      )}

      {/* Shared Note Comments Drawer */}
      {canComment && (
        <CommentsDrawer
          open={commentsDrawerOpen}
          onClose={() => {
            setCommentsDrawerOpen(false);
            setActiveAnchor(null);
          }}
          note={shareData}
          activeAnchor={activeAnchor}
          onClearAnchor={() => setActiveAnchor(null)}
          onCommentClick={handleCommentClick}
          customAddComment={(data) => addShareComment(shareId, data)}
          customDeleteComment={(id) => deleteShareComment(shareId, id, shareData.comments)}
        />
      )}
    </div>
  );
}
