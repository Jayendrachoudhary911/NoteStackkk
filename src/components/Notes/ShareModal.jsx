import React, { useState, useEffect } from 'react';
import {
  Share2,
  Lock,
  Globe,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  Eye,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as sharingService from '../../firebase/sharing';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function ShareModal({ open, onClose, note }) {
  const { userProfile } = useAuth();
  const { showToast } = useToast();

  const [isPublic, setIsPublic] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [accessLevel, setAccessLevel] = useState('view'); // 'view' | 'comment'
  const [loading, setLoading] = useState(true);
  const [savingOptions, setSavingOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEscapeKey(onClose, open);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${note?.id}` : '';

  useEffect(() => {
    if (!open || !note?.id) return;
    setLoading(true);
    sharingService
      .getShareForNote(note.id)
      .then((shareRecord) => {
        if (shareRecord) {
          setIsPublic(Boolean(shareRecord.isPublic));
          setAllowComments(shareRecord.allowComments !== false);
          setAccessLevel(shareRecord.accessLevel || 'view');
        } else {
          setIsPublic(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching share status:', err);
      })
      .finally(() => setLoading(false));
  }, [open, note?.id]);

  const handleTogglePublic = async (enable) => {
    if (!note) return;
    try {
      setLoading(true);
      if (enable) {
        await sharingService.enablePublicShare(note, userProfile?.fullName || 'Anonymous', {
          allowComments,
          accessLevel,
        });
        setIsPublic(true);
        showToast('Public link activated', 'success');
      } else {
        await sharingService.disablePublicShare(note.id);
        setIsPublic(false);
        showToast('Public link deactivated', 'info');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to update share settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOptions = async (newAllowComments, newAccessLevel) => {
    if (!note?.id || !isPublic) return;
    try {
      setSavingOptions(true);
      await sharingService.updateShareOptions(note.id, {
        allowComments: newAllowComments,
        accessLevel: newAccessLevel,
      });
      setAllowComments(newAllowComments);
      setAccessLevel(newAccessLevel);
      showToast('Sharing options updated', 'success');
    } catch (err) {
      console.error('Failed to update options:', err);
      showToast('Error saving options', 'error');
    } finally {
      setSavingOptions(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open || !note) return null;

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 500, padding: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Share2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Share Note</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                "{note.title || 'Untitled Note'}"
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

        {/* Options Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {/* Private Option */}
          <div
            onClick={() => !loading && handleTogglePublic(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg)',
              background: !isPublic ? 'var(--surface-container-high)' : 'var(--surface-container)',
              border: !isPublic ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ color: !isPublic ? 'var(--accent)' : 'var(--muted-foreground)' }}>
              <Lock size={20} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Private</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                Only you and invited collaborators can view this note.
              </div>
            </div>
            {!isPublic && <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />}
          </div>

          {/* Public Link Option */}
          <div
            onClick={() => !loading && handleTogglePublic(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 'var(--radius-lg)',
              background: isPublic ? 'var(--surface-container-high)' : 'var(--surface-container)',
              border: isPublic ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ color: isPublic ? 'var(--accent)' : 'var(--muted-foreground)' }}>
              <Globe size={20} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>Anyone with the link</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                Anyone on the web with this URL can access this note.
              </div>
            </div>
            {isPublic && <Check size={18} style={{ color: 'var(--accent)' }} />}
          </div>
        </div>

        {/* Public Share Settings when Active */}
        {isPublic && (
          <div
            style={{
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 20,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)' }}>
              Public Link Options & Permissions
            </div>

            {/* Permission Selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <Eye size={15} style={{ color: 'var(--accent)' }} />
                <span>Access Permissions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {savingOptions && <Loader2 size={13} className="spin" style={{ color: 'var(--accent)' }} />}
                <select
                  value={accessLevel}
                  disabled={savingOptions}
                  onChange={(e) => handleUpdateOptions(allowComments, e.target.value)}
                  style={{
                    background: 'var(--surface-container-high)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 8px',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  <option value="view">Can view only</option>
                  <option value="comment">Can view & comment</option>
                  <option value="edit">Can view & edit</option>
                </select>
              </div>
            </div>

            {accessLevel === 'edit' && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--accent)',
                  background: 'var(--surface-container)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>✏️</span>
                <span>Anyone with this link will be able to edit this note directly.</span>
              </div>
            )}

            {/* Allow Comments Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <MessageSquare size={15} style={{ color: 'var(--accent)' }} />
                <span>Allow Readers to Leave Comments</span>
              </div>
              <input
                type="checkbox"
                checked={allowComments}
                disabled={savingOptions}
                onChange={(e) => handleUpdateOptions(e.target.checked, accessLevel)}
                style={{ cursor: 'pointer', width: 16, height: 16 }}
              />
            </div>

            {/* Share URL Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  flexGrow: 1,
                  background: 'var(--surface-container-high)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--foreground)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleCopy}
                className="ns-btn ns-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="ns-btn ns-btn-ghost"
                style={{ padding: 6, display: 'flex' }}
                title="Preview public note"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="ns-btn ns-btn-primary" style={{ padding: '8px 18px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}