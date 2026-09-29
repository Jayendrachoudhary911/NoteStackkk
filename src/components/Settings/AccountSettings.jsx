import React, { useState } from 'react';
import { ShieldAlert, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../UI/ConfirmDialog';

export default function AccountSettings() {
  const { logout, deleteAccount } = useAuth();
  const { showToast } = useToast();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      showToast('Your account was successfully deleted', 'info');
    } catch (e) {
      console.error(e);
      showToast('Error deleting account: ' + (e.message || 'Requires recent login'), 'error');
    }
  };

  return (
    <>
      <div className="ns-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <ShieldAlert size={20} style={{ color: '#ef4444' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Account & Danger Zone</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Sign Out of NoteStack</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                Securely end your current session on this device
              </div>
            </div>
            <button
              onClick={logout}
              className="ns-btn ns-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          {/* Delete Account */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ef4444' }}>
                Delete Account
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
                Permanently delete your profile and authentication records. This action cannot be reversed.
              </div>
            </div>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="ns-btn ns-btn-danger"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Trash2 size={15} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Permanently delete your NoteStack account?"
        description="This will permanently delete your authentication credentials and profile information. Any local notes will no longer be accessible under this account."
        confirmLabel="Yes, Delete My Account"
        isDestructive={true}
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
