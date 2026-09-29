import React, { useState, useEffect } from 'react';
import { User, Mail, AtSign, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProfileSettings() {
  const { currentUser, userProfile, updateUserProfileData } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setUsername(userProfile.username || '');
    } else if (currentUser) {
      setFullName(currentUser.displayName || '');
      setUsername(currentUser.email ? currentUser.email.split('@')[0] : '');
    }
  }, [userProfile, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    try {
      setIsSaving(true);
      await updateUserProfileData({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
      });
      showToast('Profile updated successfully', 'success');
    } catch (e) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const initial = (fullName || 'U').charAt(0).toUpperCase();

  return (
    <div className="ns-card" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <User size={20} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Profile Information</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Avatar Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#09090b',
              fontSize: '1.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            {initial}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{fullName || 'NoteStack User'}</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--muted-foreground)' }}>
              @{username || 'username'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--muted-foreground)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
                fontSize: '0.92rem',
                color: 'var(--foreground)',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--muted-foreground)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Username
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0 12px',
              }}
            >
              <AtSign size={15} style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 8px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.92rem',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Email Address
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              gap: 10,
              color: 'var(--muted-foreground)',
              fontSize: '0.9rem',
            }}
          >
            <Mail size={16} />
            <span>{currentUser?.email}</span>
            <span style={{ fontSize: '0.72rem', marginLeft: 'auto', background: 'var(--surface-container-high)', padding: '2px 8px', borderRadius: 4 }}>
              Managed by Firebase Auth
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="submit"
            disabled={isSaving}
            className="ns-btn ns-btn-primary"
            style={{ padding: '10px 20px' }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}