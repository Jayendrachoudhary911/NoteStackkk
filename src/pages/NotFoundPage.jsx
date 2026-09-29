import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  FileText,
  Star,
  Folder,
  Compass
} from 'lucide-react';
import NotFoundIllustration from '../components/Illustrations/NotFoundIllustration';
import { useAppTheme } from '../context/ThemeContext';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        backgroundColor: 'var(--background, #09090b)',
        color: 'var(--foreground, #f8fafc)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 580,
          background: isDark ? 'rgba(23, 25, 32, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
          borderRadius: 'var(--radius-xl, 26px)',
          padding: '44px 32px',
          boxShadow: 'var(--elevation-dialog)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Floating Space 404 Illustration */}
        <div style={{ marginBottom: 20 }}>
          <NotFoundIllustration size={280} />
        </div>

        {/* 404 Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'var(--surface-container-high, #20232d)',
            color: 'var(--accent, #3b82f6)',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          <Compass size={14} />
          Error 404
        </div>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: 10,
          }}
        >
          Lost in Note Space?
        </h1>

        <p
          style={{
            color: 'var(--muted-foreground, #9ca3af)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: 420,
            marginBottom: 28,
          }}
        >
          The page or note you are searching for might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          <button
            onClick={() => navigate(-1)}
            className="ns-btn ns-btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="ns-btn ns-btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem', textDecoration: 'none' }}
          >
            <Home size={16} />
            <span>Return to Workspace</span>
          </Link>
        </div>

        {/* Quick Navigation Shortcuts */}
        <div
          style={{
            width: '100%',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/notes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--muted-foreground)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
          >
            <FileText size={14} />
            <span>All Notes</span>
          </Link>

          <Link
            to="/favorites"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--muted-foreground)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Star size={14} />
            <span>Favorites</span>
          </Link>

          <Link
            to="/folders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--muted-foreground)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Folder size={14} />
            <span>Folders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
