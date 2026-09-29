import React, { useState, useRef } from 'react';
import { Image, Trash2, X, Upload, Loader2, Sparkles } from 'lucide-react';
import { compressImageToBase64 } from '../../utils/imageCompressor';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const COVER_PRESETS = [
  { id: 'grad-blue', label: 'Cosmic Blue', css: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' },
  { id: 'grad-amber', label: 'Amber Twilight', css: 'linear-gradient(135deg, #78350f 0%, #1c1917 100%)' },
  { id: 'grad-emerald', label: 'Emerald Forest', css: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' },
  { id: 'grad-purple', label: 'Violet Nebula', css: 'linear-gradient(135deg, #581c87 0%, #1e1b4b 100%)' },
  { id: 'grad-sunset', label: 'Warm Glow', css: 'linear-gradient(135deg, #831843 0%, #312e81 100%)' },
  { id: 'grad-slate', label: 'Minimal Slate', css: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)' },
];

export default function CoverPickerModal({ open, onClose, currentCover, onSelectCover, onRemoveCover }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEscapeKey(onClose, open);

  if (!open) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError('');
      const base64 = await compressImageToBase64(file, 1400, 800, 0.82);
      onSelectCover(`url("${base64}") center/cover no-repeat`);
      onClose();
    } catch (err) {
      console.error('Failed to convert image to base64:', err);
      setUploadError('Failed to process image. Please try another file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 480, padding: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
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
              <Image size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Note Cover Banner</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Upload an image (saved as Base64 in Firestore) or pick a preset
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

        {/* Upload Custom Image Button */}
        <div style={{ marginBottom: 18 }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="ns-btn ns-btn-secondary"
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1px dashed var(--border-subtle)',
              background: 'var(--surface-container-high)',
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="spin" style={{ color: 'var(--accent)' }} />
                <span>Converting & saving Base64 image...</span>
              </>
            ) : (
              <>
                <Upload size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>Upload Image from Computer (Base64)</span>
              </>
            )}
          </button>
          {uploadError && (
            <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 6 }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Preset Palettes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
            Or Choose a Gradient Preset
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {COVER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectCover(preset.css);
                onClose();
              }}
              style={{
                height: 64,
                borderRadius: 'var(--radius-md)',
                background: preset.css,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '8px 10px',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {preset.label}
            </div>
          ))}
        </div>

        {currentCover && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => {
                onRemoveCover();
                onClose();
              }}
              className="ns-btn ns-btn-danger"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Trash2 size={14} />
              Remove Cover
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
