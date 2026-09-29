import React from 'react';

export const NoteCardSkeleton = () => {
  return (
    <div
      className="ns-card ns-skeleton"
      style={{
        height: 200,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: 0.6,
      }}
    >
      <div>
        <div
          style={{
            height: 24,
            width: '65%',
            borderRadius: 6,
            background: 'var(--surface-container-high)',
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 14,
            width: '90%',
            borderRadius: 4,
            background: 'var(--surface-container-high)',
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 14,
            width: '75%',
            borderRadius: 4,
            background: 'var(--surface-container-high)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            height: 14,
            width: '30%',
            borderRadius: 4,
            background: 'var(--surface-container-high)',
          }}
        />
        <div
          style={{
            height: 20,
            width: 48,
            borderRadius: 10,
            background: 'var(--surface-container-high)',
          }}
        />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div
          className="ns-skeleton"
          style={{ height: 40, width: 280, borderRadius: 8, marginBottom: 8 }}
        />
        <div
          className="ns-skeleton"
          style={{ height: 20, width: 360, borderRadius: 6 }}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        <NoteCardSkeleton />
        <NoteCardSkeleton />
        <NoteCardSkeleton />
      </div>
    </div>
  );
};

export const EditorSkeleton = () => {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '40px 24px' }}>
      <div
        className="ns-skeleton"
        style={{ height: 48, width: '60%', borderRadius: 8, marginBottom: 24 }}
      />
      <div
        className="ns-skeleton"
        style={{ height: 20, width: '100%', borderRadius: 6, marginBottom: 16 }}
      />
      <div
        className="ns-skeleton"
        style={{ height: 20, width: '85%', borderRadius: 6, marginBottom: 16 }}
      />
      <div
        className="ns-skeleton"
        style={{ height: 20, width: '92%', borderRadius: 6, marginBottom: 16 }}
      />
    </div>
  );
};

export const AppLoadingScreen = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 760, padding: 32 }}>
        <DashboardSkeleton />
      </div>
    </div>
  );
};

