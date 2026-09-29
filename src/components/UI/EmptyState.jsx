import React from 'react';

export default function EmptyState({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        maxWidth: 440,
        margin: '0 auto',
      }}
    >
      {illustration && <div style={{ marginBottom: 24 }}>{illustration}</div>}
      {title && (
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--foreground)',
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--muted-foreground)',
            marginBottom: actionLabel ? 24 : 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="ns-btn ns-btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.95rem' }}
        >
          {ActionIcon && <ActionIcon size={18} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
