import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  LogIn,
  Loader2
} from 'lucide-react';
import { getTeam, joinTeam } from '../firebase/teams';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { useAppTheme } from '../context/ThemeContext';

export default function JoinTeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setActiveTeam } = useTeam();
  const { mode } = useAppTheme();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchTeamDetails() {
      if (!teamId) {
        setError('No team ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const teamData = await getTeam(teamId);
        if (!mounted) return;

        if (!teamData) {
          setError('Team workspace not found or the invite link has expired.');
        } else {
          setTeam(teamData);
          if (currentUser && (teamData.memberUids || []).includes(currentUser.uid)) {
            setSuccess(true);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Error fetching team invite:', err);
          setError('Failed to load team invite details. Please try again.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTeamDetails();
    return () => {
      mounted = false;
    };
  }, [teamId, currentUser]);

  const handleJoinTeam = async () => {
    if (!currentUser) {
      navigate(`/login?redirect=/join-team/${teamId}`);
      return;
    }

    try {
      setJoining(true);
      setError(null);
      await joinTeam(teamId, currentUser);
      setSuccess(true);
      if (setActiveTeam && team) {
        setActiveTeam(team);
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Failed to join team:', err);
      setError(err.message || 'Failed to join team workspace.');
    } finally {
      setJoining(false);
    }
  };

  const handleGoToTeam = () => {
    if (setActiveTeam && team) {
      setActiveTeam(team);
    }
    navigate('/dashboard');
  };

  const isDark = mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--bg-primary, #0f172a)',
        color: 'var(--text-primary, #f8fafc)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: isDark
            ? 'rgba(30, 41, 59, 0.75)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 40px rgba(59, 130, 246, 0.05)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {loading ? (
          <div style={{ padding: '40px 0' }}>
            <Loader2
              size={40}
              className="animate-spin"
              style={{ margin: '0 auto 16px', color: '#3b82f6' }}
            />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>
              Loading Team Invite...
            </h3>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.9rem' }}>
              Verifying workspace invitation link
            </p>
          </div>
        ) : error ? (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <AlertCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
              Invite Invalid or Expired
            </h2>
            <p
              style={{
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: '0.95rem',
                marginBottom: '28px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#3b82f6',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            {/* Team Icon Avatar */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: team?.color
                  ? `linear-gradient(135deg, ${team.color}, ${team.color}cc)`
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                margin: '0 auto 20px',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
              }}
            >
              {team?.icon || '👥'}
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                fontSize: '0.78rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={13} />
              Team Invitation
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              {team?.name || 'NoteStack Team'}
            </h2>

            {team?.description ? (
              <p
                style={{
                  color: 'var(--text-secondary, #94a3b8)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                {team.description}
              </p>
            ) : (
              <p
                style={{
                  color: 'var(--text-secondary, #94a3b8)',
                  fontSize: '0.95rem',
                  marginBottom: '20px',
                }}
              >
                Collaborate on live synced notes, shared files, and comments in real-time.
              </p>
            )}

            {/* Team meta info card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '14px 18px',
                borderRadius: '16px',
                background: isDark
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(241, 245, 249, 0.8)',
                marginBottom: '28px',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {team?.members?.length || 1} Member{(team?.members?.length || 1) !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ width: '1px', height: '20px', background: 'rgba(148, 163, 184, 0.2)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Live Workspace
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {!currentUser ? (
              <div>
                <Link
                  to={`/login?redirect=/join-team/${teamId}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <LogIn size={18} />
                  Sign In to Join Team
                </Link>
                <p
                  style={{
                    marginTop: '14px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary, #94a3b8)',
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    to={`/signup?redirect=/join-team/${teamId}`}
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            ) : success ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#10b981',
                    fontWeight: 600,
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span>You're a member of this workspace!</span>
                </div>
                <button
                  type="button"
                  onClick={handleGoToTeam}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <span>Open Team Workspace</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleJoinTeam}
                disabled={joining}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: joining ? 'not-allowed' : 'pointer',
                  opacity: joining ? 0.7 : 1,
                  boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                }}
              >
                {joining ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Joining Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Join Workspace</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
