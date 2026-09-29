import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import {
  ArrowLeft,
  Share2,
  Download,
  Star,
  Maximize2,
  Minimize2,
  Folder,
  Image,
  Check,
  Loader2,
  WifiOff,
  AlertCircle,
  Info,
  Paperclip,
  MessageSquare
} from 'lucide-react';

import { useNotes } from '../../context/NotesContext';
import { useAppTheme } from '../../context/ThemeContext';
import { formatRelativeTime } from '../../utils/formatDate';
import { compressImageToBase64 } from '../../utils/imageCompressor';
import IconPickerModal from './IconPickerModal';
import CoverPickerModal from './CoverPickerModal';
import MediaEmbedModal from './MediaEmbedModal';
import MediaEmbedList from './MediaEmbedList';
import NoteTagBar from './NoteTagBar';
import ShareModal from '../Notes/ShareModal';
import ExportMenu from '../Notes/ExportMenu';
import MoveToFolderModal from '../Notes/MoveToFolderModal';
import NoteInfoDrawer from '../Notes/NoteInfoDrawer';
import CommentsDrawer from '../Notes/CommentsDrawer';
import ActiveUsersBar from '../UI/ActiveUsersBar';
import { applyCommentHighlights } from '../../utils/commentHighlighter';

export default function NoteEditor({ note }) {
  const navigate = useNavigate();
  const { updateNote, folders, toggleFavorite } = useNotes();
  const { mode } = useAppTheme();

  // Local state
  const [title, setTitle] = useState(note?.title || '');
  const [icon, setIcon] = useState(note?.icon || '📝');
  const [cover, setCover] = useState(note?.cover || null);
  const [mediaLinks, setMediaLinks] = useState(note?.mediaLinks || []);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'offline' | 'error'
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Modals state
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState(null);
  const [selectionTooltip, setSelectionTooltip] = useState(null);

  // Floating selection comment listener
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

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => setSaveStatus('saved');
    const handleOffline = () => setSaveStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const editorContainerRef = useRef(null);
  const isLocallyEditingRef = useRef(false);
  const localEditingTimerRef = useRef(null);

  // Synchronize when note prop changes
  useEffect(() => {
    if (note) {
      if (!isLocallyEditingRef.current) {
        setTitle(note.title || '');
      }
      setIcon(note.icon || '📝');
      setCover(note.cover || null);
      setMediaLinks(Array.isArray(note.mediaLinks) ? note.mediaLinks : []);
    }
  }, [note]);

  // Initial Content for BlockNote
  const initialContent = React.useMemo(() => {
    if (!note?.content) return undefined;
    try {
      const parsed = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [note?.content]);

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

  // Live remote content reconciliation across collaborators
  useEffect(() => {
    if (!editor || !note?.content) return;
    if (isLocallyEditingRef.current || saveStatus === 'saving') return;

    try {
      const remoteBlocks = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
      if (Array.isArray(remoteBlocks) && remoteBlocks.length > 0) {
        const currentDocStr = JSON.stringify(editor.document);
        const remoteDocStr = JSON.stringify(remoteBlocks);
        if (currentDocStr !== remoteDocStr) {
          editor.replaceBlocks(editor.document, remoteBlocks);
        }
      }
    } catch (err) {
      console.warn('Live block reconcile error:', err);
    }
  }, [editor, note?.content, saveStatus]);

  // Dynamic comment highlight and symbol decorator
  useEffect(() => {
    if (!editorContainerRef.current) return;
    const timer = setTimeout(() => {
      applyCommentHighlights(editorContainerRef.current, note?.comments || [], (comment) => {
        setCommentsDrawerOpen(true);
        setActiveAnchor({ selectedText: comment.selectedText });
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [note?.comments, note?.content]);

  // Extract plain text from blocks
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

  // Autosave Debounce Engine
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  const triggerAutosave = useCallback(
    (currentTitle, currentIcon, currentCover, currentMediaLinks) => {
      if (!note?.id) return;
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
          const documentBlocks = editor.document;
          const plainText = extractPlainText(documentBlocks);

          await updateNote(note.id, {
            title: currentTitle.trim() || 'Untitled Note',
            content: JSON.stringify(documentBlocks),
            plainText,
            icon: currentIcon,
            cover: currentCover,
            mediaLinks: currentMediaLinks || [],
          });

          setSaveStatus('saved');
        } catch (err) {
          console.error('Autosave error:', err);
          setSaveStatus('error');
        }
      }, 900);
    },
    [note?.id, editor, extractPlainText, updateNote]
  );

  // Listen to editor content changes
  useEffect(() => {
    if (!editor) return;
    const unsub = editor.onChange(() => {
      isLocallyEditingRef.current = true;
      if (localEditingTimerRef.current) clearTimeout(localEditingTimerRef.current);
      localEditingTimerRef.current = setTimeout(() => {
        isLocallyEditingRef.current = false;
      }, 1500);

      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      triggerAutosave(title, icon, cover, mediaLinks);
    });
    return () => unsub?.();
  }, [editor, title, icon, cover, mediaLinks, triggerAutosave]);

  // Handle title changes
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    isLocallyEditingRef.current = true;
    if (localEditingTimerRef.current) clearTimeout(localEditingTimerRef.current);
    localEditingTimerRef.current = setTimeout(() => {
      isLocallyEditingRef.current = false;
    }, 1500);

    setTitle(newTitle);
    triggerAutosave(newTitle, icon, cover, mediaLinks);
  };

  // Handle icon selection
  const handleSelectIcon = (newIcon) => {
    setIcon(newIcon);
    triggerAutosave(title, newIcon, cover, mediaLinks);
  };

  // Handle cover selection / removal
  const handleSelectCover = (newCover) => {
    setCover(newCover);
    triggerAutosave(title, icon, newCover, mediaLinks);
  };

  const handleRemoveCover = () => {
    setCover(null);
    triggerAutosave(title, icon, null, mediaLinks);
  };

  // Media link handlers
  const handleAddMedia = async (mediaItem) => {
    const updated = [...mediaLinks, mediaItem];
    setMediaLinks(updated);
    triggerAutosave(title, icon, cover, updated);
  };

  const handleRemoveMedia = async (mediaId) => {
    const updated = mediaLinks.filter((m) => m.id !== mediaId);
    setMediaLinks(updated);
    triggerAutosave(title, icon, cover, updated);
  };

  // In-Note tag update handler
  const handleUpdateTags = async (newTags) => {
    if (!note?.id) return;
    await updateNote(note.id, { tags: newTags });
  };

  // Jump to and highlight commented section in the editor
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

  // Focus mode keyboard shortcut (Ctrl/Cmd + Shift + F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const folder = folders.find((f) => f.id === note?.folderId);
  const commentCount = Array.isArray(note?.comments) ? note.comments.length : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: isFocusMode ? 'var(--background)' : 'transparent',
        position: isFocusMode ? 'fixed' : 'relative',
        inset: isFocusMode ? 0 : undefined,
        zIndex: isFocusMode ? 950 : 1,
        overflowY: isFocusMode ? 'auto' : 'visible',
      }}
    >
      {/* Top Editor Bar */}
      {!isFocusMode && (
        <div
          className="no-print ns-editor-toolbar"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--surface)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Left: Back button and Folder Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate(-1)}
              className="ns-btn ns-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            {/* Folder breadcrumb */}
            <button
              onClick={() => setMoveModalOpen(true)}
              className="ns-btn ns-btn-ghost"
              style={{
                padding: '4px 10px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Click to change folder"
            >
              <Folder size={14} style={{ color: folder?.color || 'var(--accent)' }} />
              <span style={{ fontWeight: 600 }}>{folder ? folder.name : 'No folder'}</span>
            </button>
          </div>

          {/* Center/Right: Active Presence, Media, Comments, Share, Export, Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Active Users Indicator */}
            <ActiveUsersBar currentNoteId={note?.id} />

            {/* Save Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.8rem',
                fontWeight: 500,
                color:
                  saveStatus === 'error'
                    ? '#ef4444'
                    : saveStatus === 'offline'
                    ? '#f5d397'
                    : 'var(--muted-foreground)',
                marginLeft: 4,
                marginRight: 4,
              }}
            >
              {saveStatus === 'saving' && (
                <>
                  <Loader2 size={13} className="spin" style={{ color: 'var(--accent)' }} />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check size={14} style={{ color: 'var(--accent)' }} />
                  <span>Saved</span>
                </>
              )}
              {saveStatus === 'offline' && (
                <>
                  <WifiOff size={13} />
                  <span>Offline</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle size={13} />
                  <span>Error saving</span>
                </>
              )}
            </div>

            {/* Embed Media Link Trigger */}
            <button
              onClick={() => setMediaModalOpen(true)}
              className="ns-btn ns-btn-ghost"
              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              title="Embed YouTube, Google Drive, Video, Audio, or File Link"
            >
              <Paperclip size={15} />
              <span>Media</span>
            </button>

            {/* Comments Drawer Trigger */}
            <button
              onClick={handleOpenComments}
              className="ns-btn ns-btn-ghost"
              style={{
                padding: '6px 10px',
                fontSize: '0.82rem',
                position: 'relative',
              }}
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

            {/* Focus Mode Toggle */}
            <button
              onClick={() => setIsFocusMode(true)}
              className="ns-btn ns-btn-ghost"
              style={{ padding: 6 }}
              title="Focus Mode (Ctrl+Shift+F)"
            >
              <Maximize2 size={16} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="ns-btn ns-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setExportMenuOpen(true)}
              className="ns-btn ns-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <Download size={15} />
              <span>Export</span>
            </button>

            {/* Favorite Star */}
            <button
              onClick={() => toggleFavorite(note.id, note.isFavorite)}
              className="ns-btn ns-btn-ghost"
              style={{
                padding: 6,
                color: note?.isFavorite ? '#f5d397' : 'var(--muted-foreground)',
              }}
              title={note?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={18} style={{ fill: note?.isFavorite ? '#f5d397' : 'none' }} />
            </button>

            {/* Note Info Drawer Trigger */}
            <button
              onClick={() => setInfoDrawerOpen(true)}
              className="ns-btn ns-btn-ghost"
              style={{ padding: 6 }}
              title="Note details"
            >
              <Info size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Exit Focus Mode Button */}
      {isFocusMode && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 24,
            zIndex: 999,
          }}
        >
          <button
            onClick={() => setIsFocusMode(false)}
            className="ns-btn ns-btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
            }}
          >
            <Minimize2 size={15} />
            <span>Exit Focus Mode</span>
          </button>
        </div>
      )}

      {/* Optional Note Cover Banner */}
      {cover && (
        <div
          style={{
            height: isFocusMode ? 140 : 180,
            width: '100%',
            background: cover,
            position: 'relative',
            transition: 'height var(--transition-normal)',
          }}
        >
          {!isFocusMode && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 24,
                display: 'flex',
                gap: 8,
              }}
            >
              <button
                onClick={() => setCoverPickerOpen(true)}
                className="ns-btn ns-btn-secondary"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  background: 'rgba(0,0,0,0.65)',
                  color: '#ffffff',
                }}
              >
                Change Cover
              </button>
              <button
                onClick={handleRemoveCover}
                className="ns-btn ns-btn-danger"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Note Canvas Container */}
      <div
        className="ns-note-print-surface"
        style={{
          width: '100%',
          maxWidth: isFocusMode ? 960 : 860,
          margin: '0 auto',
          padding: isFocusMode ? '48px 32px' : '36px 24px 80px',
          flexGrow: 1,
          transition: 'max-width var(--transition-normal)',
        }}
      >
        {/* Cover / Icon Quick Add Controls (if no cover) */}
        {!cover && !isFocusMode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
              opacity: 0.7,
            }}
          >
            <button
              onClick={() => setCoverPickerOpen(true)}
              className="ns-btn ns-btn-ghost"
              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
            >
              <Image size={14} />
              <span>Add Cover</span>
            </button>
          </div>
        )}

        {/* Note Icon Picker Trigger */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setIconPickerOpen(true)}
            style={{
              fontSize: '2.5rem',
              lineHeight: 1,
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              transition: 'transform var(--transition-fast)',
              display: 'inline-block',
            }}
            title="Click to change icon"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {icon}
          </button>
        </div>

        {/* Large Borderless Title */}
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
            marginBottom: 6,
            letterSpacing: '-0.02em',
          }}
        />

        {/* In-Note Tag Management Bar */}
        <NoteTagBar note={note} onUpdateTags={handleUpdateTags} />

        {/* Subtle Metadata Under Title */}
        <div
          style={{
            fontSize: '0.82rem',
            color: 'var(--muted-foreground)',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>Updated {formatRelativeTime(note?.updatedAt)}</span>
          <span>•</span>
          <span>
            {extractPlainText(editor.document).trim().split(/\s+/).filter(Boolean).length} words
          </span>
          {mediaLinks.length > 0 && (
            <>
              <span>•</span>
              <span>{mediaLinks.length} media attached</span>
            </>
          )}
        </div>

        {/* Embedded Media & External Resources */}
        <MediaEmbedList mediaLinks={mediaLinks} onRemoveMedia={handleRemoveMedia} />

        {/* BlockNote WYSIWYG Editor View */}
        <div ref={editorContainerRef} style={{ minHeight: 450, position: 'relative' }}>
          <BlockNoteView
            editor={editor}
            uploadFile={handleImageUpload}
            theme={mode === 'dark' ? 'dark' : 'light'}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
      <IconPickerModal
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelectIcon={handleSelectIcon}
      />

      <CoverPickerModal
        open={coverPickerOpen}
        onClose={() => setCoverPickerOpen(false)}
        currentCover={cover}
        onSelectCover={handleSelectCover}
        onRemoveCover={handleRemoveCover}
      />

      <MediaEmbedModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onAddMedia={handleAddMedia}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        note={note}
      />

      <ExportMenu
        open={exportMenuOpen}
        onClose={() => setExportMenuOpen(false)}
        note={note}
        editorInstance={editor}
      />

      <MoveToFolderModal
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        note={note}
      />

      <NoteInfoDrawer
        open={infoDrawerOpen}
        onClose={() => setInfoDrawerOpen(false)}
        note={note}
      />

      {/* Floating Selection Comment Action */}
      {selectionTooltip && (
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

      <CommentsDrawer
        open={commentsDrawerOpen}
        onClose={() => {
          setCommentsDrawerOpen(false);
          setActiveAnchor(null);
        }}
        note={note}
        activeAnchor={activeAnchor}
        onClearAnchor={() => setActiveAnchor(null)}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
}