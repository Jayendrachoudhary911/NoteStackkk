import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  X,
  FolderArchive,
  Music,
  Video,
  Plus,
  Check,
  UploadCloud,
  Loader2
} from 'lucide-react';
import Youtube from '@mui/icons-material/YouTube';
import { parseMediaLink, readFileAsMediaItem } from '../../utils/mediaEmbedHelper';
import { compressImageToBase64 } from '../../utils/imageCompressor';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function MediaEmbedModal({ open, onClose, onAddMedia }) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'upload'
  const [url, setUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [detectedMedia, setDetectedMedia] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (!open) {
      setUrl('');
      setCustomTitle('');
      setDetectedMedia(null);
      setSelectedFile(null);
      setUploading(false);
      setError('');
      setActiveTab('url');
    }
  }, [open]);

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    setError('');

    if (val.trim()) {
      const parsed = parseMediaLink(val.trim());
      if (parsed) {
        setDetectedMedia(parsed);
        if (!customTitle) {
          setCustomTitle(parsed.defaultTitle);
        }
      } else {
        setDetectedMedia(null);
      }
    } else {
      setDetectedMedia(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!customTitle) {
      setCustomTitle(file.name);
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === 'upload') {
      if (!selectedFile) {
        setError('Please select an image, video, or media file to upload');
        return;
      }
      try {
        setUploading(true);
        setError('');

        let media;
        if (selectedFile.type.startsWith('image/')) {
          const base64 = await compressImageToBase64(selectedFile, 1200, 800, 0.85);
          media = {
            type: 'image',
            platform: 'Image',
            originalUrl: base64,
            embedUrl: base64,
            defaultTitle: selectedFile.name,
            icon: '🖼️',
            mimeType: selectedFile.type,
            size: selectedFile.size,
          };
        } else {
          media = await readFileAsMediaItem(selectedFile);
        }

        const mediaItem = {
          id: 'media-' + Math.random().toString(36).substr(2, 9),
          type: media.type,
          platform: media.platform,
          url: media.originalUrl || media.url,
          embedUrl: media.embedUrl,
          title: customTitle.trim() || media.defaultTitle,
          icon: media.icon,
          mimeType: media.mimeType,
          size: media.size,
          addedAt: new Date().toISOString(),
        };
        onAddMedia(mediaItem);
        onClose();
      } catch (err) {
        console.error('File read error:', err);
        setError(err.message || 'Failed to process this media file');
      } finally {
        setUploading(false);
      }
      return;
    }

    if (!url.trim()) {
      setError('Please provide a valid URL');
      return;
    }

    const parsed = parseMediaLink(url.trim());
    if (!parsed) {
      setError('Could not process this link');
      return;
    }

    const mediaItem = {
      id: 'media-' + Math.random().toString(36).substr(2, 9),
      type: parsed.type,
      platform: parsed.platform,
      url: parsed.originalUrl,
      embedUrl: parsed.embedUrl,
      title: customTitle.trim() || parsed.defaultTitle,
      icon: parsed.icon,
      addedAt: new Date().toISOString(),
    };

    onAddMedia(mediaItem);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 480, padding: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Link2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Embed Media or Link</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                YouTube, Google Drive, Spotify, Audio, Video, or Cloud Files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'var(--surface-container-high)', padding: 4, borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`ns-btn ${activeTab === 'url' ? 'ns-btn-secondary' : 'ns-btn-ghost'}`}
            style={{
              flex: 1,
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'url' ? 700 : 500,
              background: activeTab === 'url' ? 'var(--surface)' : 'transparent',
              boxShadow: activeTab === 'url' ? 'var(--elevation-1)' : 'none',
            }}
          >
            <Link2 size={14} />
            <span>Embed Link / URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`ns-btn ${activeTab === 'upload' ? 'ns-btn-secondary' : 'ns-btn-ghost'}`}
            style={{
              flex: 1,
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'upload' ? 700 : 500,
              background: activeTab === 'upload' ? 'var(--surface)' : 'transparent',
              boxShadow: activeTab === 'upload' ? 'var(--elevation-1)' : 'none',
            }}
          >
            <UploadCloud size={14} />
            <span>Upload Media / File</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeTab === 'url' ? (
            <>
              {/* Supported badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Youtube size={12} style={{ color: '#ef4444' }} /> YouTube
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Video size={12} style={{ color: '#8b5cf6' }} /> MP4 / WebM / MOV
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <FolderArchive size={12} style={{ color: '#3b82f6' }} /> Google Drive
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Music size={12} style={{ color: '#10b981' }} /> Spotify / Audio
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                  Paste Media / Video URL
                </label>
                <input
                  type="url"
                  placeholder="https://... direct .mp4, YouTube, Drive, or audio"
                  value={url}
                  onChange={handleUrlChange}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    background: 'var(--surface-container-high)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>

              {detectedMedia && (
                <div
                  style={{
                    background: 'var(--surface-container)',
                    border: '1px solid var(--accent)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{detectedMedia.icon}</span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)' }}>
                      Detected {detectedMedia.platform}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--muted-foreground)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {detectedMedia.originalUrl}
                    </div>
                  </div>
                  <Check size={16} style={{ color: 'var(--accent)' }} />
                </div>
              )}
            </>
          ) : (
            <>
              {/* File Upload Box */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: selectedFile ? 'var(--surface-container)' : 'var(--surface-container-high)',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                {selectedFile ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>
                      {selectedFile.type.startsWith('video/')
                        ? '🎬'
                        : selectedFile.type.startsWith('image/')
                        ? '🖼️'
                        : '📎'}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--foreground)' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: 2 }}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Saved as synced string in Firestore
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      Click to choose image, video, or media file
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: 4 }}>
                      Images, Videos (MP4, WebM, MOV), Audio (saved directly in Firestore)
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
              Title / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Project Demo Video or Spec Document"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="ns-btn ns-btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="ns-btn ns-btn-primary"
              style={{ padding: '8px 18px' }}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>{activeTab === 'upload' ? 'Attach Video to Note' : 'Embed into Note'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
