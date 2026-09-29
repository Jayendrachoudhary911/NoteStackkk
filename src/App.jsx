import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeCustomProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';
import { TeamProvider } from './context/TeamContext';
import { ToastProvider } from './context/ToastContext';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import RecentPage from './pages/RecentPage';
import FavoritesPage from './pages/FavoritesPage';
import PinnedPage from './pages/PinnedPage';
import FoldersPage from './pages/FoldersPage';
import FolderPage from './pages/FolderPage';
import TagsPage from './pages/TagsPage';
import TrashPage from './pages/TrashPage';
import SettingsPage from './pages/SettingsPage';
import NotePage from './pages/NotePage';
import SharedNotePage from './pages/SharedNotePage';
import JoinTeamPage from './pages/JoinTeamPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout & UI
import MainLayout from './components/Layout/MainLayout';
import { AppLoadingScreen } from './components/UI/Skeleton';
import SplashScreen from './components/UI/SplashScreen';

function ProtectedRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <NotesProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/pinned" element={<PinnedPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/folders/:folderId" element={<FolderPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/trash" element={<TrashPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/note/:noteId" element={<NotePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </NotesProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeCustomProvider>
        <ToastProvider>
          <AuthProvider>
            <SplashScreen />
            <TeamProvider>
              <Routes>
                {/* Public route accessible without authentication */}
                <Route path="/share/:shareId" element={<SharedNotePage />} />
                {/* Team invite joining route */}
                <Route path="/join-team/:teamId" element={<JoinTeamPage />} />
                {/* All other routes are protected */}
                <Route path="/*" element={<ProtectedRoutes />} />
              </Routes>
            </TeamProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeCustomProvider>
    </BrowserRouter>
  );
}
