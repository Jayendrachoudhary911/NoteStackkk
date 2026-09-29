import React, { useState } from 'react';
import {
  User,
  Palette,
  Sliders,
  Database,
  ShieldAlert,
  Settings
} from 'lucide-react';
import ProfileSettings from '../components/Settings/ProfileSettings';
import AppearanceSettings from '../components/Settings/AppearanceSettings';
import EditorSettings from '../components/Settings/EditorSettings';
import DataSettings from '../components/Settings/DataSettings';
import AccountSettings from '../components/Settings/AccountSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Sliders },
    { id: 'data', label: 'Data & Backup', icon: Database },
    { id: 'account', label: 'Account', icon: ShieldAlert },
  ];

  return (
    <div style={{ padding: '36px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Settings size={24} style={{ color: 'var(--accent)' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Settings
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted-foreground)' }}>
          Manage your account profile, themes, editor preferences, and workspace data
        </p>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 8,
          marginBottom: 28,
          overflowX: 'auto',
        }}
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="ns-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--surface-container-high)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--muted-foreground)',
                boxShadow: isActive ? 'var(--elevation-2)' : 'none',
                fontWeight: isActive ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'editor' && <EditorSettings />}
        {activeTab === 'data' && <DataSettings />}
        {activeTab === 'account' && <AccountSettings />}
      </div>
    </div>
  );
}
