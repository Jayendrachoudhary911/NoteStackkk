import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function SplashScreen() {
  const { loading } = useAuth();
  const { mode } = useAppTheme();
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Keep splash visible for at least 650ms for brand presence, then fade out once auth finishes loading
    const minTimer = setTimeout(() => {
      if (!loading) {
        setFadingOut(true);
        setTimeout(() => setVisible(false), 450);
      }
    }, 650);

    return () => clearTimeout(minTimer);
  }, [loading]);

  useEffect(() => {
    if (!loading && !fadingOut) {
      const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => setVisible(false), 450);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, fadingOut]);

  if (!visible) return null;

  const isDark = mode === 'dark';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: isDark
          ? 'radial-gradient(ellipse at 50% 40%, #172554 0%, #09090b 80%)'
          : 'radial-gradient(ellipse at 50% 40%, #dbeafe 0%, #f8fafc 80%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 24,
        }}
      >
        {/* Animated Brand Logo Icon with Glow */}
        <div
          style={{
            position: 'relative',
            width: 88,
            height: 88,
            borderRadius: '28px',
            background: 'linear-gradient(135deg, var(--accent, #3b82f6), #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.8rem',
            color: '#fff',
            boxShadow: '0 12px 36px -4px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
            marginBottom: 24,
            animation: 'floatIllustration 3.5s ease-in-out infinite',
          }}
        >
          ⚡
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '32px',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 8,
            color: 'var(--foreground, #f8fafc)',
            textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          NoteStack
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--muted-foreground, #94a3b8)',
            maxWidth: 320,
            lineHeight: 1.5,
            marginBottom: 32,
          }}
        >
          Your thoughts, seamlessly organized and synced in real-time.
        </p>

        {/* Shimmering Progress Bar */}
        <div
          style={{
            width: 180,
            height: 4,
            borderRadius: 999,
            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '50%',
              borderRadius: 999,
              background: 'linear-gradient(90deg, transparent, var(--accent, #3b82f6), transparent)',
              animation: 'shimmerAnimation 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
