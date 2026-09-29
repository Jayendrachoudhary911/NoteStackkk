import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Trash2,
  Crown,
  Shield,
  User,
  Loader2,
  Link2,
  Check,
  Copy,
  AtSign
} from 'lucide-react';
import { useTeam } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { findUserByUsernameOrEmail } from '../../firebase/teams';

export default function TeamSettingsModal({ open, onClose, team }) {
  const { currentUser } = useAuth();
  const { addMember, removeMember, updateMemberRole, deleteTeam } = useTeam();

  const [inviteInput, setInviteInput] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEscapeKey(onClose, open);

  if (!open || !team) return null;

  const isOwner = team.ownerId === currentUser?.uid;
  const isAdmin = isOwner || Boolean(team.adminUids && team.adminUids.includes(currentUser?.uid));
  const canManage = isOwner || isAdmin;

  const inviteUrl = `${window.location.origin}/join-team/${team.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const query = inviteInput.trim();
    if (!query) return;

    try {
      setLoading(true);
      setError('');

      let targetEmail = query;
      let targetName = inviteName.trim();
      let targetUid = null;

      // Check if it is a username or email lookup
      const foundUser = await findUserByUsernameOrEmail(query);
      if (foundUser) {
        targetEmail = foundUser.email;
        targetName = targetName || foundUser.fullName || foundUser.username;
        targetUid = foundUser.uid;
      } else if (!query.includes('@')) {
        throw new Error(`Could not find any user with username "${query}"`);
      }

      await addMember(team.id, {
        email: targetEmail,
        name: targetName || targetEmail.split('@')[0],
        uid: targetUid,
        role: inviteRole,
      });

      setInviteInput('');
      setInviteName('');
      setInviteRole('member');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberUid, newRole) => {
    try {
      await updateMemberRole(team.id, memberUid, newRole);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (memberUid) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await removeMember(team.id, memberUid);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm(`Are you sure you want to delete team "${team.name}"? This action cannot be undone.`)) return;
    try {
      await deleteTeam(team.id);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 540, padding: 24 }}
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
            <span style={{ fontSize: '1.8rem' }}>{team.icon || '👥'}</span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{team.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                {team.members?.length || 1} team members • {team.description || 'Workspace'}
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

        {/* Share Team Link Section */}
        {canManage && (
          <div
            style={{
              background: 'var(--surface-container)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 16,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Link2 size={14} style={{ color: 'var(--accent)' }} />
              <span>Shareable Team Invite Link</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                readOnly
                value={inviteUrl}
                style={{
                  flexGrow: 1,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '0.78rem',
                  color: 'var(--muted-foreground)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="ns-btn ns-btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                {copiedLink ? (
                  <>
                    <Check size={13} style={{ color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', marginTop: 6, marginBotom: 0 }}>
              Anyone with this link can join this team workspace directly.
            </p>
          </div>
        )}

        {/* Invite Member Section (Username or Email) */}
        {canManage && (
          <form
            onSubmit={handleInvite}
            style={{
              background: 'var(--surface-container-high)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserPlus size={15} style={{ color: 'var(--accent)' }} />
              <span>Add Member by Username or Email</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexGrow: 1, minWidth: 160 }}>
                <AtSign
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="email@example.com or @username"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px 6px 30px',
                    fontSize: '0.82rem',
                    color: 'var(--foreground)',
                    outline: 'none',
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Name (Optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                style={{
                  width: 120,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontSize: '0.82rem',
                  color: 'var(--foreground)',
                  outline: 'none',
                }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  color: 'var(--foreground)',
                  outline: 'none',
                }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="ns-btn ns-btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', flexShrink: 0 }}
              >
                {loading ? <Loader2 size={13} className="spin" /> : 'Invite'}
              </button>
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>{error}</div>}
          </form>
        )}

        {/* Member List */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted-foreground)', marginBottom: 10 }}>
            Team Members ({team.members?.length || 1})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
            {(team.members || []).map((m) => {
              const isMemberOwner = m.role === 'owner' || m.uid === team.ownerId;
              const isMemberAdmin = !isMemberOwner && (m.role === 'admin' || (team.adminUids && team.adminUids.includes(m.uid)));
              const isSelf = m.uid === currentUser?.uid;

              return (
                <div
                  key={m.uid || m.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-container)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      {(m.name || m.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                        {m.name || m.email.split('@')[0]} {isSelf && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        {m.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isMemberOwner ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#f59e0b',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Crown size={11} />
                        Owner
                      </span>
                    ) : isOwner ? (
                      <select
                        value={isMemberAdmin ? 'admin' : 'member'}
                        onChange={(e) => handleRoleChange(m.uid, e.target.value)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--surface-container-high)',
                          color: isMemberAdmin ? 'var(--accent)' : 'var(--foreground)',
                          border: '1px solid var(--border-subtle)',
                          outline: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: isMemberAdmin ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface-container-high)',
                          color: isMemberAdmin ? '#3b82f6' : 'var(--muted-foreground)',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isMemberAdmin ? <Shield size={11} /> : <User size={11} />}
                        {isMemberAdmin ? 'Admin' : 'Member'}
                      </span>
                    )}

                    {(isOwner || (isAdmin && !isMemberAdmin && !isMemberOwner)) && !isMemberOwner && (
                      <button
                        onClick={() => handleRemove(m.uid)}
                        style={{ color: '#ef4444', padding: 4, borderRadius: 4 }}
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Danger Zone */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          {isOwner ? (
            <button
              onClick={handleDeleteTeam}
              className="ns-btn ns-btn-danger"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Trash2 size={14} />
              <span>Delete Team</span>
            </button>
          ) : (
            <div />
          )}

          <button onClick={onClose} className="ns-btn ns-btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
