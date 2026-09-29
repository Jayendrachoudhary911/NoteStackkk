import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast: addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: 'var(--surface-container-high)',
              color: 'var(--foreground)',
              boxShadow: 'var(--elevation-dialog)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 260,
              maxWidth: 380,
              animation: 'nsSlideUp 180ms ease-out',
            }}
          >
            {toast.type === 'success' && (
              <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            )}
            {toast.type === 'error' && (
              <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            )}
            {toast.type === 'info' && (
              <Info size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '0.88rem', fontWeight: 500, flexGrow: 1 }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: 'var(--muted-foreground)',
                padding: 2,
                display: 'flex',
                borderRadius: 4,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
