import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useTeam } from './TeamContext';
import { useToast } from './ToastContext';
import * as notesService from '../firebase/notes';
import * as foldersService from '../firebase/folders';
import * as tagsService from '../firebase/tags';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { currentTeam } = useTeam();
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to notes (scoped to active team or personal workspace)
  useEffect(() => {
    if (!currentUser) {
      setNotes([]);
      setFolders([]);
      setTags([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let unsubNotes;
    if (currentTeam?.id) {
      // In team workspace: listen to team notes
      unsubNotes = notesService.subscribeTeamNotes(
        currentTeam.id,
        (fetchedNotes) => {
          setNotes(fetchedNotes);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      // In personal workspace: listen to user notes without teamId
      unsubNotes = notesService.subscribeNotes(
        currentUser.uid,
        (fetchedNotes) => {
          setNotes(fetchedNotes.filter((n) => !n.teamId));
          setLoading(false);
        },
        () => setLoading(false)
      );
    }

    const unsubFolders = foldersService.subscribeFolders(
      currentUser.uid,
      (fetchedFolders) => {
        setFolders(fetchedFolders);
      }
    );

    const unsubTags = tagsService.subscribeTags(
      currentUser.uid,
      (fetchedTags) => {
        setTags(fetchedTags);
      }
    );

    return () => {
      unsubNotes();
      unsubFolders();
      unsubTags();
    };
  }, [currentUser, currentTeam?.id]);

  // Derived note buckets
  const activeNotes = useMemo(() => {
    return notes.filter((n) => !n.isDeleted && !n.isArchived);
  }, [notes]);

  const favoriteNotes = useMemo(() => {
    return notes.filter((n) => !n.isDeleted && n.isFavorite);
  }, [notes]);

  const pinnedNotes = useMemo(() => {
    return notes.filter((n) => !n.isDeleted && n.isPinned);
  }, [notes]);

  const recentNotes = useMemo(() => {
    return [...activeNotes].sort((a, b) => {
      const timeA = a.lastOpenedAt?.toMillis ? a.lastOpenedAt.toMillis() : (a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0);
      const timeB = b.lastOpenedAt?.toMillis ? b.lastOpenedAt.toMillis() : (b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0);
      return timeB - timeA;
    });
  }, [activeNotes]);

  const archivedNotes = useMemo(() => {
    return notes.filter((n) => !n.isDeleted && n.isArchived);
  }, [notes]);

  const trashNotes = useMemo(() => {
    return notes.filter((n) => n.isDeleted);
  }, [notes]);

  // Writing activity calculations
  const activityStats = useMemo(() => {
    let totalWords = 0;
    const activeDaysSet = new Set();
    let editedCount = 0;

    notes.forEach((n) => {
      if (n.isDeleted) return;
      if (n.plainText) {
        const words = n.plainText.trim().split(/\s+/).filter(Boolean).length;
        totalWords += words;
      }
      if (n.updatedAt?.toDate) {
        const dateStr = n.updatedAt.toDate().toDateString();
        activeDaysSet.add(dateStr);
      }
      if (n.createdAt && n.updatedAt && n.createdAt.seconds !== n.updatedAt.seconds) {
        editedCount++;
      }
    });

    return {
      totalNotes: activeNotes.length,
      totalFolders: folders.length,
      totalWords,
      notesEdited: editedCount,
      activeDays: Math.max(1, activeDaysSet.size),
    };
  }, [notes, activeNotes, folders]);

  // Note CRUD actions
  const createNote = useCallback(async (initialData = {}) => {
    if (!currentUser) return null;
    try {
      const payload = {
        ...initialData,
        teamId: initialData.teamId !== undefined ? initialData.teamId : (currentTeam?.id || null),
      };
      const newNote = await notesService.createNote(currentUser.uid, payload);
      showToast('Note created', 'success');
      return newNote;
    } catch (e) {
      console.error('Failed to create note:', e);
      showToast('Error creating note', 'error');
      throw e;
    }
  }, [currentUser, currentTeam, showToast]);

  const updateNote = useCallback(async (noteId, updates) => {
    try {
      await notesService.updateNote(noteId, updates);
    } catch (e) {
      console.error('Failed to update note:', e);
      showToast('Failed to save note changes', 'error');
      throw e;
    }
  }, [showToast]);

  const touchNote = useCallback(async (noteId) => {
    try {
      await notesService.touchNoteOpened(noteId);
    } catch (e) {
      // Non-critical, ignore
    }
  }, []);

  const softDeleteNote = useCallback(async (noteId) => {
    try {
      await notesService.softDeleteNote(noteId);
      showToast('Note moved to trash', 'info');
    } catch (e) {
      showToast('Failed to delete note', 'error');
    }
  }, [showToast]);

  const restoreNote = useCallback(async (noteId) => {
    try {
      await notesService.restoreNote(noteId);
      showToast('Note restored', 'success');
    } catch (e) {
      showToast('Failed to restore note', 'error');
    }
  }, [showToast]);

  const permanentlyDeleteNote = useCallback(async (noteId) => {
    try {
      await notesService.permanentlyDeleteNote(noteId);
      showToast('Note deleted permanently', 'info');
    } catch (e) {
      showToast('Failed to permanently delete note', 'error');
    }
  }, [showToast]);

  const emptyTrash = useCallback(async () => {
    try {
      await notesService.emptyTrash(trashNotes);
      showToast('Trash emptied', 'info');
    } catch (e) {
      showToast('Failed to empty trash', 'error');
    }
  }, [trashNotes, showToast]);

  const toggleFavorite = useCallback(async (noteId, currentStatus) => {
    try {
      await notesService.toggleFavorite(noteId, currentStatus);
      showToast(currentStatus ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (e) {
      showToast('Failed to update favorites', 'error');
    }
  }, [showToast]);

  const togglePinned = useCallback(async (noteId, currentStatus) => {
    try {
      await notesService.togglePinned(noteId, currentStatus);
      showToast(currentStatus ? 'Note unpinned' : 'Note pinned', 'success');
    } catch (e) {
      showToast('Failed to update pin', 'error');
    }
  }, [showToast]);

  const archiveNote = useCallback(async (noteId, currentStatus) => {
    try {
      await notesService.archiveNote(noteId, currentStatus);
      showToast(currentStatus ? 'Note unarchived' : 'Note archived', 'info');
    } catch (e) {
      showToast('Failed to archive note', 'error');
    }
  }, [showToast]);

  const moveNote = useCallback(async (noteId, folderId) => {
    try {
      await notesService.moveNote(noteId, folderId);
      showToast('Note moved', 'success');
    } catch (e) {
      showToast('Failed to move note', 'error');
    }
  }, [showToast]);

  const duplicateNote = useCallback(async (originalNote) => {
    if (!currentUser || !originalNote) return null;
    try {
      const copy = await notesService.duplicateNote(originalNote, currentUser.uid);
      showToast('Note duplicated', 'success');
      return copy;
    } catch (e) {
      showToast('Failed to duplicate note', 'error');
      return null;
    }
  }, [currentUser, showToast]);

  // Folder Actions
  const createFolder = useCallback(async (data) => {
    if (!currentUser) return null;
    try {
      const folder = await foldersService.createFolder(currentUser.uid, data);
      showToast('Folder created', 'success');
      return folder;
    } catch (e) {
      showToast('Failed to create folder', 'error');
      return null;
    }
  }, [currentUser, showToast]);

  const updateFolder = useCallback(async (folderId, updates) => {
    try {
      await foldersService.updateFolder(folderId, updates);
      showToast('Folder updated', 'success');
    } catch (e) {
      showToast('Failed to update folder', 'error');
    }
  }, [showToast]);

  const deleteFolder = useCallback(async (folderId) => {
    try {
      await foldersService.deleteFolder(folderId, currentUser?.uid);
      showToast('Folder deleted', 'info');
    } catch (e) {
      showToast('Failed to delete folder', 'error');
    }
  }, [currentUser, showToast]);

  // Tag Actions
  const createTag = useCallback(async (name) => {
    if (!currentUser) return null;
    try {
      return await tagsService.createTag(currentUser.uid, name);
    } catch (e) {
      return null;
    }
  }, [currentUser]);

  const deleteTag = useCallback(async (tagId) => {
    try {
      await tagsService.deleteTag(tagId);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNotes,
        favoriteNotes,
        pinnedNotes,
        recentNotes,
        archivedNotes,
        trashNotes,
        folders,
        tags,
        loading,
        activityStats,
        createNote,
        updateNote,
        touchNote,
        softDeleteNote,
        restoreNote,
        permanentlyDeleteNote,
        emptyTrash,
        toggleFavorite,
        togglePinned,
        archiveNote,
        moveNote,
        duplicateNote,
        createFolder,
        updateFolder,
        deleteFolder,
        createTag,
        deleteTag,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
