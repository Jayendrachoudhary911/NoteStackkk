import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Film
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAppTheme } from '../context/ThemeContext';
import AuthHeroIllustration from '../components/Illustrations/AuthHeroIllustration';

export default function AuthPage() {
  const { login, signup, googleLogin, resetPassword } = useAuth();
  const { showToast } = useToast();
  const { mode } = useAppTheme();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculator for signup
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (authMode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your registered email address.');
        return;
      }
      try {
        setLoading(true);
        await resetPassword(email.trim());
        setSuccessMessage('Password reset link sent! Check your inbox.');
        showToast('Password reset email sent', 'success');
      } catch (err) {
        setError(err.message || 'Failed to send password reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (authMode === 'signup') {
      if (!fullName.trim() || !username.trim()) {
        setError('Please enter your full name and choose a unique username.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      try {
        setLoading(true);
        await signup(email.trim(), password, username.trim(), fullName.trim());
        showToast('Welcome to NoteStack! Your workspace is ready.', 'success');
      } catch (err) {
        setError(err.message || 'Registration failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign in
    try {
      setLoading(true);
      await login(email.trim(), password);
      showToast('Welcome back!', 'success');
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await googleLogin();
      showToast('Signed in with Google', 'success');
    } catch (err) {
      setError(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: isDark
          ? 'radial-gradient(ellipse at 70% 30%, #1e1b4b 0%, #09090b 80%)'
          : 'radial-gradient(ellipse at 70% 30%, #e0e7ff 0%, #f8fafc 80%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1040,
          minHeight: 620,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          borderRadius: '28px',
          overflow: 'hidden',
          background: isDark
            ? 'rgba(17, 18, 22, 0.85)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: isDark
            ? '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.15)'
            : '0 30px 60px -15px rgba(0, 0, 0, 0.08), 0 0 50px rgba(99, 102, 241, 0.06)',
        }}
      >
        {/* Left Interactive Showcase / Hero Panel */}
        <div
          style={{
            background: isDark
              ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
              : 'linear-gradient(145deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.6))',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
          }}
        >
          <div>
            {/* Logo Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--accent, #3b82f6), #6366f1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  boxShadow: '0 8px 16px -3px rgba(99, 102, 241, 0.4)',
                }}
              >
                ⚡
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
                  NoteStack
                </span>
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#6366f1',
                    textTransform: 'uppercase',
                  }}
                >
                  Pro
                </span>
              </div>
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--foreground)',
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                marginBottom: 10,
              }}
            >
              Collaborate in real-time with beautiful clarity.
            </h2>
            <p
              style={{
                color: 'var(--muted-foreground)',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Live block sync, inline highlighted comments, rich media storage, and instant team links.
            </p>
          </div>

          {/* Centered Animated Hero SVG */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <AuthHeroIllustration size={280} />
          </div>

          {/* Interactive Feature Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                fontWeight: 600,
              }}
            >
              <Zap size={15} style={{ color: '#f59e0b' }} />
              <span>Real-Time Sync</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                fontWeight: 600,
              }}
            >
              <Sparkles size={15} style={{ color: '#8b5cf6' }} />
              <span>Inline Comments</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                fontWeight: 600,
              }}
            >
              <Film size={15} style={{ color: '#ec4899' }} />
              <span>Media & Videos</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: '12px',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                fontWeight: 600,
              }}
            >
              <Users size={15} style={{ color: '#10b981' }} />
              <span>Team Workspaces</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div
          style={{
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'var(--surface)',
          }}
        >
          {/* Animated Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface-container-high)',
              borderRadius: '16px',
              padding: 4,
              marginBottom: 24,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '12px',
                background: authMode === 'login' ? 'var(--surface)' : 'transparent',
                color: authMode === 'login' ? 'var(--accent)' : 'var(--muted-foreground)',
                fontWeight: authMode === 'login' ? 700 : 500,
                fontSize: '0.9rem',
                boxShadow: authMode === 'login' ? 'var(--elevation-2)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '12px',
                background: authMode === 'signup' ? 'var(--surface)' : 'transparent',
                color: authMode === 'signup' ? 'var(--accent)' : 'var(--muted-foreground)',
                fontWeight: authMode === 'signup' ? 700 : 500,
                fontSize: '0.9rem',
                boxShadow: authMode === 'signup' ? 'var(--elevation-2)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            >
              <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {authMode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                    Full Name
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--surface-container-high)',
                      borderRadius: '12px',
                      padding: '0 14px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <User size={17} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.9rem',
                        color: 'var(--foreground)',
                      }}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                    Username
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--surface-container-high)',
                      borderRadius: '12px',
                      padding: '0 14px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <AtSign size={17} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                    <input
                      type="text"
                      required
                      placeholder="alex_morgan"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 10px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.9rem',
                        color: 'var(--foreground)',
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--surface-container-high)',
                  borderRadius: '12px',
                  padding: '0 14px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Mail size={17} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 10px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            {authMode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--accent)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--surface-container-high)',
                    borderRadius: '12px',
                    padding: '0 14px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Lock size={17} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 10px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.9rem',
                      color: 'var(--foreground)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--muted-foreground)',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Indicator on Signup */}
                {authMode === 'signup' && password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, height: 4, borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          flex: 1,
                          background: strength.score >= 1 ? strength.color : 'var(--surface-container)',
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: strength.score >= 2 ? strength.color : 'var(--surface-container)',
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: strength.score >= 3 ? strength.color : 'var(--surface-container)',
                          borderRadius: 2,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          background: strength.score >= 4 ? strength.color : 'var(--surface-container)',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600, marginTop: 4 }}>
                      Password Strength: {strength.label}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ns-btn ns-btn-primary"
              style={{
                width: '100%',
                padding: '13px 0',
                marginTop: 8,
                fontSize: '0.95rem',
                borderRadius: '14px',
                fontWeight: 700,
                boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.4)',
              }}
            >
              <span>
                {loading
                  ? 'Please wait...'
                  : authMode === 'login'
                  ? 'Sign In to Workspace'
                  : authMode === 'signup'
                  ? 'Create Free Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight size={17} />
            </button>
          </form>

          {authMode === 'forgot' && (
            <button
              onClick={() => setAuthMode('login')}
              className="ns-btn ns-btn-ghost"
              style={{ marginTop: 14, fontSize: '0.88rem' }}
            >
              Back to Sign In
            </button>
          )}

          {/* Social OAuth Divider */}
          {authMode !== 'forgot' && (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  margin: '20px 0 16px',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                <span>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="ns-btn ns-btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  fontSize: '0.92rem',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontWeight: 600,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google Account</span>
              </button>
            </>
          )}

          <div
            style={{
              marginTop: 22,
              textAlign: 'center',
              fontSize: '0.78rem',
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>Encrypted & Secured with Google Firebase Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}